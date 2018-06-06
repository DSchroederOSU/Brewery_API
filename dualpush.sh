#!/usr/bin/env bash
#   A script to push to two git repositories
#   For example, a GitHub classroom repo and a personal repo
#

#define the name of your first remote
first_remote=personal

#define the name of your second remote
second_remote=origin

bash -c "git push $first_remote master && git push $second_remote master"