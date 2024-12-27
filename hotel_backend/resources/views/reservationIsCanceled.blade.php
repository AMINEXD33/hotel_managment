<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link href="{{ asset('css/cancelReservation.css') }}" rel="stylesheet">
    <title>cancel reservation</title>
</head>
<body>
    <div class="content">
        <div class="header">
            <h1> {{$user->name}} , your reservation was canceled !</h1>
        </div>
        <div class="body">
            <h2>more information:</h2>
            <ul>
                <li>hotel :{{$hotel->name}}</li>
                <li>room ID :{{$reservation->id}}</li>
            </ul>
            <p>
                if this is a mistake please feel free to reachout to us!.
                thank you for your time.
            </p>

        </div>
    </div>
</body>
</html>
