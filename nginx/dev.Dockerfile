FROM nginx


# Replace default conf and with custom conf
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/

COPY templates/invman.dev.conf.template /etc/nginx/templates/