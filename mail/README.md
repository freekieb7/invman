## First time

First time installing the server, you should add an email:

`docker exec -it <container_name> setup email add admin@example.com`

Afterwards you should add an alias for the postmaster account

`docker exec -it <container_name> setup alias add postmaster@example.com admin@example.com`

