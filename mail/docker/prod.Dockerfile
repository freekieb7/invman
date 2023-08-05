FROM ghcr.io/docker-mailserver/docker-mailserver:latest

ARG POSTMASTER_PASSWORD

COPY ./nginx/certs/invman.nl.crt /etc/dms/tls/cert
COPY ./nginx/certs/invman.nl.key /etc/dms/tls/key

# DOESNT work
# RUN setup email add admin@invman.nl ${POSTMASTER_PASSWORD} || exit 0
# RUN setup alias add postmaster@invman.nl admin@invman.nl || exit 0