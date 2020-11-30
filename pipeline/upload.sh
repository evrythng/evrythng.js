#!/usr/bin/env bash

set -eu

aws s3 cp "/srv/dist/evrythng.browser.js" "s3://$BUCKET/js/evrythng/$VERSION/evrythng-$VERSION.js" --acl public-read
