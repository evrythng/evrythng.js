# v3.1.2 (25-06-2015)

## Features

- **documentation**: clearer usage and installation steps. Consistent format from other libs

# v3.1.1 (19-06-2015)

## Bug fixes

- **package.json**: Github url with `git://` protocol

# v3.1.0 (17-06-2015)

## Bug fixes

- **xhr**: responses without headers were being ignored

## Features

- **interceptors**: setup request and response interceptors globally or as a one-off request settings
- **plugins**: ability to install/use plugins for additional functionality

## Breaking changes

- **synchronous requests**: sync option removed for Node.js vs Browser consistency and to promote best practices
