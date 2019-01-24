#!/usr/bin/env bash
#   A script to push to two git repositories
#   For example, a GitHub classroom repo and a personal repo
#
#   This script assumes you have already defined two remote repositories
#   NOTE: This script does not catch errors and assumes you can debug console messages


# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#                                                                                   #
#  git remote add [remote_name] [repository_link]                                   #
#                                                                                   #
#  ex: git remote add classroom https://github.com/OSU-CS493-Sp18/final-project.git #
#                                                                                   #
# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #


# REPLACE WITH THE NAME OF YOUR FIRST GIT REMOTE URL
first_remote=personal

# REPLACE WITH THE NAME OF YOUR SECOND GIT REMOTE URL
second_remote=origin

bash -c "git push $first_remote master && git push $second_remote master"