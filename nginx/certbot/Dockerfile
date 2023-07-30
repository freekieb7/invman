FROM certbot/certbot

RUN mkdir /var/www

RUN mkdir /var/www/invman

RUN certbot certonly --webroot \
    -w /var/www/invman \
    --staging \
    --agree-tos \
    -d invman.nl \
    -d *.invman.nl \
    --email freekieb7@hotmail.com \
    --no-eff-email \
    --force-renewal