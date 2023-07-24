FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/

COPY templates/invman.prod.conf.template /etc/nginx/templates/

COPY certificate/ /etc/nginx/ssl/