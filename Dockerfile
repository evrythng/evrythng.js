FROM node:12-alpine

WORKDIR /srv
COPY . /srv

# Install dependencues
RUN apk add --no-cache python3 py3-pip
RUN pip3 install awscli --upgrade --user

# Build
RUN npm ci
RUN npm run build

# Deploy
CMD ["sh", "-c", "~/.local/bin/aws s3 cp /srv/dist/evrythng.browser.js s3://$BUCKET/js/evrythng/$VERSION/evrythng-$VERSION.js --acl public-read"]
