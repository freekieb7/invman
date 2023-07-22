#!/bin/sh
project_dir="$(dirname -- $(readlink -fn -- "$0"; echo x))"
ansible-playbook ${project_dir}/ansible/playbook.yml -i ${project_dir}/ansible/inventory.yml -e @${project_dir}/ansible/secrets.yml -K