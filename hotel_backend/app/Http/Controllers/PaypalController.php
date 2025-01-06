<?php

namespace App\Http\Controllers;

use App\Models\Reservations;
use App\Models\Rooms;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use PayPalCheckoutSdk\Core\PayPalHttpClient;
use PayPalCheckoutSdk\Core\SandboxEnvironment;
use PayPalCheckoutSdk\Core\LiveEnvironment;
use PayPalCheckoutSdk\Orders\OrdersCreateRequest;
use PayPalCheckoutSdk\Orders\OrdersCaptureRequest;
use PayPalHttp\HttpException;
use DateTime;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
class PayPalController extends Controller
{
    private $client;

    public function __construct()
    {
        // Set up PayPal environment (sandbox or live)
        $environment = new SandboxEnvironment(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret')
        );
        $this->client = new PayPalHttpClient($environment);
    }
    private function getPayPalClient()
    {
        $environment = new SandboxEnvironment(
            config('services.paypal.client_id'),
            config('services.paypal.client_secret')
        );

        return new PayPalHttpClient($environment);
    }
    /**
     * Create a PayPal order
     */
    public function createOrder(Request $request)
    {
        try {
            // Validate inputs
            $validated = $request->validate([
                'amount' => 'required|numeric|min:0',
                'checkin' => 'required|date',
                'checkout' => 'required|date|after:checkin',
                'id_room' => 'required|exists:rooms,id'  // Assuming you have a rooms table
            ]);

            // Convert dates to desired format if needed
            $checkinDate =  Carbon::parse($validated['checkin'])->startOfDay();
            $checkoutDate =  Carbon::parse($validated['checkout'])->startOfDay();
            $total = null;
            // make sure our dates don't overlap
            $reservation_ranges = Reservations::query()
                ->join("rooms", "reservations.id_room", "=", "rooms.id")
                ->where("reservations.id_room",$validated['id_room'])
                ->get(["check_in", "check_out"]);

            // room
            $room = Rooms::query()->find($validated['id_room']);
            if(!$room){
                return response()->json(['error' => "we couldn't process your reservation"], 422);
            }
            // Parse and normalize ISO dates
            $existing_check_in = Carbon::parse($checkinDate)->startOfDay();
            $existing_check_out = Carbon::parse( $checkoutDate)->startOfDay();

            // Validate date range
            if ($existing_check_out->lt($existing_check_in)) {
                throw new Exception("Check-out date cannot be before check-in date.");
            }

            // Calculate total days and cost
            $totalDays = $existing_check_in->diffInDays($existing_check_out) + 1; // Inclusive
            $total = $totalDays * $room->price;

            $total = number_format($total, 2, '.', '');
            // check if the select range doesn't overlap with any other reservation
            foreach($reservation_ranges as $reservation_range) {
                $existing_check_in = Carbon::parse($reservation_range->check_in)->startOfDay();
                $existing_check_out = Carbon::parse($reservation_range->check_out)->startOfDay();
                if ($checkinDate <= $existing_check_out && $checkoutDate >= $existing_check_in) {
                    // Overlap detected
                    return response()->json(['error' => 'The room is not available for the selected dates.'], 422);
                }
            }
            // if no total
            if (!$total){
                return response()->json(['error' => "we couldn't process your reservation"], 422);
            }
            // Create the order data structure that PayPal expects
            $orderData = [
                "intent" => "CAPTURE",
                "purchase_units" => [
                    [
                        "amount" => [
                            "currency_code" => "USD",
                            "value" => $total
                        ],
                        "description" => "Room booking from " . $checkinDate->format('Y-m-d') .
                                         " to " . $checkoutDate->format('Y-m-d'),
                        "id_room" => $validated['id_room'],
                        "custom" => json_encode([
                            "checkin" => $checkinDate->format('Y-m-d\TH:i:s\Z'),
                            "checkout" => $checkoutDate->format('Y-m-d\TH:i:s\Z'),
                        ])
                    ]
                ],
                "application_context" => [
                    "return_url" => route('success.order'),
                    "cancel_url" => route('cancel.order'),
                    "brand_name" => "Your Hotel Name",
                    "landing_page" => "LOGIN",
                    "user_action" => "PAY_NOW",
                    "shipping_preference" => "NO_SHIPPING"
                ]
            ];


            // Create and execute the PayPal order request
            $orderRequest = new OrdersCreateRequest();
            $orderRequest->prefer('return=representation');
            $orderRequest->body = $orderData;

            $response = $this->client->execute($orderRequest);


            $checkin = \Carbon\Carbon::parse($validated['checkin'])->toDateTimeString();
            $checkout = \Carbon\Carbon::parse($validated['checkout'])->toDateTimeString();
            // store this paiment attempt
            DB::table("paiment_attepmts")->insert([
                "paiment_id"=> $response->result->id,
                "id_room"=> $validated['id_room'],
                "check_in"=>$checkin,
                "check_out"=> $checkout,
                'total'=>$total,
                "created_at"=>\Carbon\Carbon::now(),
                "updated_at"=>\Carbon\Carbon::now()
            ]);
            // Return the order ID and status to the frontend
            return response()->json([
                'orderID' => $response->result->id,
                'status' => $response->result->status,
                'links' => $response->result->links
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'error' => 'Validation failed',
                'details' => $e->errors()
            ], 422);
        } catch (HttpException $e) {
            \Log::error('PayPal API Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'PayPal API error',
                'message' => $e->getMessage()
            ], 500);
        } catch (\Exception $e) {
            \Log::error('Order Creation Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Internal server error',
                'message' => 'An unexpected error occurred',
            ], 500);
        }
    }

    /**
     * Capture the PayPal order after approval
     */
    public function captureOrder(Request $request)
    {
        // Validate the order ID
        $orderId = $request->input('orderID');
        if (empty($orderId)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Order ID is required'
            ], 400);
        }

        try {
            // get access tok
            $accessToken = $this->getAccessToken();
            $url = "https://api-m.sandbox.paypal.com/v2/checkout/orders/{$orderId}/capture";
            // send the request with the access token
            $response = Http::withToken($accessToken)
            ->withHeaders(['Content-Type' => 'application/json']) // Ensures correct headers
            ->send('POST', $url);
            // sinse we're still in dev just log
            \Log::info('Raw PayPal API response', [
                'status_code' => $response->status(),
                'body' => $response->body(),
                'json' => $response->json(),
            ]);
            // jsonify the request
            $responseData = $response->json(); // This decodes the response to a PHP array
            // get some data
            $transactionId = $responseData['purchase_units'][0]['payments']['captures'][0]['id'] ?? null;
            $paymentStatus = $responseData['status'] ?? null;
            $amount = $responseData['purchase_units'][0]['payments']['captures'][0]['amount']['value'] ?? null;
            $payerEmail = $responseData['payer']['email_address'] ?? null;

            // Log for debugging
            \Log::info('PayPal Payment Success', [
                'order_id' => $orderId,
                'transaction_id' => $transactionId,
                'payment_status' => $paymentStatus,
                'amount' => $amount,
                'payer_email' => $payerEmail,
            ]);

            // Check for successful payment
            if ($paymentStatus && $paymentStatus === 'COMPLETED') {
                // Store payment details in database
                try {
                    $paymentDetails = DB::table("paiment_attepmts")->where('paiment_id', $orderId)->first();
                    $infos = [];
                    $session_id = Auth::id();
                    if (!$paymentDetails) {
                        return response()->json(["message"=>"can't find a trasaction"], 420);
                    }
                    \Log::info("This is the payment details", (array) $paymentDetails);
                    $user = User::query()->find($session_id);
                    $infos["check_in"] = $paymentDetails->check_in;
                    $infos["check_out"] = $paymentDetails->check_out;
                    $infos["id_room"] = $paymentDetails->id_room;
                    $infos["id_customer"] = $user->id;
                    $infos["total_price"] = $paymentDetails->total;

                    Reservations::factory()->create($infos);
                } catch (\Exception $e) {
                    \Log::error('Failed to store payment details', [
                        'order_id' => $orderId,
                        'error' => $e->getMessage()
                    ]);
                    return response()->json(["message" => "Failed to store payment details, don't worry just contact the admins we know you paid."]);
                }

                return response()->json([
                    'order_id' => $orderId,
                    'transaction_id' => $transactionId,
                    'payment_status' => $paymentStatus,
                    'amount' => $amount,
                    'payer_email' => $payerEmail,
                ]);
            }

            // Payment not completed
            return response()->json([
                'status' => 'error',
                'message' => 'Payment was not successful. Status: ' . ($paymentStatus ?? 'UNKNOWN'),
                'details' => $response->details ?? []
            ], 400);

        } catch (HttpException $ex) {
            \Log::error('PayPal HTTP Exception', [
                'order_id' => $orderId,
                'message' => $ex->getMessage(),
                'code' => $ex->getCode(),
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'Payment processing failed. Please try again later.',
                'error_code' => $ex->getCode()
            ], 500);

        } catch (\Exception $ex) {
            \Log::error('PayPal General Exception', [
                'order_id' => $orderId,
                'message' => $ex->getMessage(),
                'trace' => $ex->getTraceAsString()
            ]);

            return response()->json([
                'status' => 'error',
                'message' => 'An unexpected error occurred. Please try again later.'
            ], 500);
        }
    }
    private function getAccessToken()
    {
        $clientId = env('PAYPAL_CLIENT_ID');
        $clientSecret = env('PAYPAL_SECRET');

        $response = Http::asForm()->withBasicAuth($clientId, $clientSecret)
            ->post('https://api-m.sandbox.paypal.com/v1/oauth2/token', [
                'grant_type' => 'client_credentials',
            ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        throw new \Exception('Unable to retrieve PayPal access token');
    }

    /**
     * Handle the PayPal cancellation
     */
    public function cancelOrder()
    {
        // Handle cancellation (optional: you can redirect user to another page)
        return response()->json(['status' => 'error', 'message' => 'Payment was canceled']);
    }

    /**
     * Handle PayPal payment success
     */
    public function successOrder(Request $request)
    {
        // You may retrieve the order ID from the request and confirm the payment here
        return view('paypal.success', ['order_id' => $request->get('orderId')]);
    }
}
