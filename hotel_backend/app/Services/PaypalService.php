<?
namespace App\Services;
use PayPal\Rest\ApiContext;
use PayPal\Auth\OAuthTokenCredential;

class PaypalService
{
    private $apiContext;

    public function __construct()
    {
        $this->apiContext = new ApiContext(
            new OAuthTokenCredential(
                env('PAYPAL_CLIENT_ID'),
                env('PAYPAL_SECRET')
            )
        );

        // Set PayPal mode
        $this->apiContext->setConfig([
            'mode' => env('PAYPAL_MODE', 'sandbox'),
        ]);
    }

    public function getApiContext()
    {
        return $this->apiContext;
    }
}