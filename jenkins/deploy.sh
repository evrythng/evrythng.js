#!/bin/bash

docker build -t evrythng-js-deploy .

docker run \
  -e "VERSION=$VERSION" \
  -e "AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" \
  -e "AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" \
  evrythng-js-deploy
