## Installation

TLS certificate

`docker run --rm -it -v "/etc/letsencrypt/:/etc/letsencrypt/" certbot/certbot certonly --manual -d *.invman.nl -d invman.nl --agree-tos --email admin@invman.nl`

DHPARAM

Change nginx -> dhparam.pem.example

Email:

`docker exec -it <container_name> setup email add admin@invman.nl`

`docker exec -it <container_name> setup alias add postmaster@invman.nl admin@invman.nl`

