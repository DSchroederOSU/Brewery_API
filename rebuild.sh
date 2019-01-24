#!/usr/bin/env bash

bash -c "docker-compose down -v && docker image rm brewerapi_api && docker-compose up"
