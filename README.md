## Installation

TLS certificate

`docker run --rm -it -v "/etc/letsencrypt/:/etc/letsencrypt/" certbot/certbot certonly --manual -d *.invman.nl -d invman.nl --agree-tos --email admin@invman.nl`

Email:

`docker exec -it <container_name> setup email add admin@example.com`

`docker exec -it <container_name> setup alias add postmaster@example.com admin@example.com`

