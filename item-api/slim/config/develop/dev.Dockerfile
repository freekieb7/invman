FROM php:8.2-fpm

# Set custom config
COPY config/develop/php.ini /usr/local/etc/php/conf.d/php.ini
COPY config/develop/xdebug.ini /usr/local/etc/php/conf.d/xdebug.ini

# Install Composer (for development purposes)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev

# Install redis extension
RUN pecl install redis-5.3.7 \
    && docker-php-ext-enable redis

# Install xdebug extension
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug

# Start composing
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install postgres extension
RUN docker-php-ext-install pgsql
