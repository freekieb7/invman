FROM ghcr.io/docker-mailserver/docker-mailserver:latest

ARG POSTMASTER_PASSWORD

RUN setup email add admin@invman.nl ${POSTMASTER_PASSWORD} || exit 0
RUN setup alias add postmaster@invman.nl admin@invman.nl || exit 0