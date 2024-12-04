# Hotel managment

The idea of this project is to manage reservations made by users and enable staff members to manage the reservations, rooms, and the hotel itself. More details will be included down for reading.


## How to set up the backend 
#### first you need to navigate to the directory : hotel_backend
```bash
  cd hotel_managment/hotel_backend
```
This directory contains a script that will take care of setting up everything Laravel needs to function.
The script will do the following:

`install php packages using artisan`
`installing js packages using npm or yarn`
`generate the encryption key`
`migrate the database`
`cach/reset caches`

⚠ if you're using yarn you need to manually comment the npm command and uncomment the yarn command in the script
`setup_bash_script.bash`

so to set up you can just
```bash
  ./setup_bash_script.bash
```
