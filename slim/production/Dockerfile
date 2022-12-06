FROM php:fpm

# Install redis ext
RUN pecl install redis-5.3.7 && docker-php-ext-enable redis

# Install opcache
RUN docker-php-ext-install opcache
COPY slim/production/opcache.ini /usr/local/etc/php/conf.d/opcache.ini

# Set data
COPY data/ /var/www/html