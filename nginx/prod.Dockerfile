FROM nginx

# Replace default conf and with custom conf
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY ./nginx/nginx.conf /etc/nginx/

COPY templates/invman.prod.conf.template /etc/nginx/templates/

COPY ./next-js/ /var/www/html/
COPY ./logs/nginx /var/log/nginx/

COPY certificate/invman.crt /etc/nginx/ssl/invman.crt
COPY certificate/invman.key /etc/nginx/ssl/invman.key
# COPY certificate/dhparam.pem /etc/nginx/ssl/dhparam.pem
# COPY certificate/ssl-params.conf /etc/nginx/ssl/ssl-params.conf