# evrythng.js

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com)

### Docker

#### Build

docker build -t evrythng.js .

#### Test

docker run --security-opt seccomp:unconfined evrythng.js docker/test.sh