#!/usr/bin/env bash

bash -c "docker-compose down -v && docker image rm final-project-brewery-api_api && docker-compose up"

