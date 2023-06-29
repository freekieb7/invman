FROM nginx

# Replace default conf and with custom conf
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/

COPY graphql.conf /etc/nginx/conf.d/
COPY oauth.conf /etc/nginx/conf.d/
COPY next-js.conf /etc/nginx/conf.d/

COPY certificate/invman.crt /etc/ssl/invman.crt
COPY certificate/invman.key /etc/ssl/invman.key