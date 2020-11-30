FROM node:10-alpine

WORKDIR /srv
COPY . /srv

# Install dependencues
RUN apk add --no-cache python3
RUN pip3 install awscli --upgrade --user
RUN npm i

# Build
RUN npm run build

# Final test
RUN npm test

# Deploy
CMD ["sh", "-c", "~/.local/bin/aws s3 cp /srv/dist/evrythng.browser.js s3://$BUCKET/js/evrythng/$VERSION/evrythng-$VERSION.js --acl public-read"]
