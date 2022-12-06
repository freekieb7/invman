FROM nginx

# Set config files
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf

COPY nginx/develop/nginx.conf /etc/nginx/
COPY nginx/develop/default.conf /etc/nginx/conf.d/
