FROM nginx

# Replace default conf and with custom conf
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY ./nginx/nginx.conf /etc/nginx/

COPY ./nginx/oauth.conf /etc/nginx/conf.d/
COPY ./nginx/graphql.conf /etc/nginx/conf.d/
COPY ./nginx/next-js.conf /etc/nginx/conf.d/

COPY ./next-js/ /var/www/html/
COPY ./logs/nginx /var/log/nginx/