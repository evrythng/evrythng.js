FROM python:3.6-slim

WORKDIR /srv

COPY . /srv

RUN pip3 install awscli --upgrade --user

CMD ["sh", "-c", "~/.local/bin/aws s3 cp /srv/dist/evrythng.browser.js s3://$BUCKET/js/evrythng/$VERSION/evrythng-$VERSION.js --acl public-read"]
