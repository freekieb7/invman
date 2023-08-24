FROM nginx

# Set nginx config
COPY ./nginx.conf /etc/nginx/

# Add server config templates
RUN rm /etc/nginx/conf.d/default.conf
COPY ./templates/development/ /etc/nginx/templates/