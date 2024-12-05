# install php packages
if ! composer install; then
    echo "\e[31m[-] some error accured when composer is\e[0m"
else
    echo "\e[32m[+] php packages are installed !\e[0m"
fi

# install js packages if you're using npm (default)
if ! npm install; then
    echo "\e[31m[-] some error accured when installing js packages via npm\e[0m"
else
    echo "\e[32m[+] npm installed the js packages !\e[0m"
fi

# install js packages if you're using yarn
# if ! yarn install; then
#     echo "\e[31m[-] some error accured when installing js packages via yarn"
# else
#     echo "\e[32m[+] yarn installed the js packages !"
# fi

# copy the env config
cp .env.example .env


# generate the encryption key
if ! php artisan key:generate; then
    echo "\e[31m[-] can't setup the encryption key with artisan key:generate command !\e[0m"
else 
    echo "\e[32m[+] encryption key is generated ! !\e[0m"
fi


#publish the configuration for sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# migrate database
if ! php artisan migrate; then
    echo "\e[31m[-] can't migrate using php artisan migrate !\e[0m"
else 
    echo "\e[32m[+] migration is completed ! !\e[0m"
fi

# reset caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

port="3341"
ip="localhost"

# start server when everything is setup
if ! php artisan serve --host=$ip --port=$port; then
    echo "\e[31m[-] can't start the dev server on port $port and host $ip\e[0m"
fi
