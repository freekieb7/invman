FROM php:fpm

# Install redis
RUN pecl install redis-5.3.7 && docker-php-ext-enable redis

COPY www.conf /usr/local/etc/php-fpm.d/

# Install Composer (for development purposes)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
