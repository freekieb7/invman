FROM php:fpm

# Install redis extension
RUN pecl install redis-5.3.7 && docker-php-ext-enable redis

# Install Composer (for development purposes)
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libpq-dev

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Install postgres extension
RUN docker-php-ext-install pgsql

# Create run tests alias command (run unit tests => rut)
# RUN alias rut='./vendor/bin/phpunit -c phpunit.xml'
