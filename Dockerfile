FROM 254677047783.dkr.ecr.us-east-1.amazonaws.com/node-headless:latest

ENV NODE_ENV development

WORKDIR /srv

ADD . .
RUN npm install
RUN npm run build