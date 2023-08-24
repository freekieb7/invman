FROM nginx

# Set nginx config
COPY ./nginx.conf /etc/nginx/

# Add server config templates
RUN rm /etc/nginx/conf.d/default.conf
COPY ./templates/production/ /etc/nginx/templates/

# Setup ssl config files
COPY ./ssl-params.conf /etc/nginx/ssl/
COPY ./dhparam.pem /etc/nginx/ssl/

# Add static files
COPY ./static/ /var/www/static/
