FROM nginx

# Set config files
RUN rm /etc/nginx/conf.d/default.conf /etc/nginx/nginx.conf

COPY nginx/production/nginx.conf /etc/nginx/
COPY nginx/production/default.conf /etc/nginx/conf.d/

# Set data required by slim
COPY data/ /var/www/html
