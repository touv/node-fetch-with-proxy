# Use isomorphic fetch behind a proxy 


A wrapper of [isomorphic-fetch](https://github.com/matthew-andrews/isomorphic-fetch) that can be use behind a proxy.

It detect standard environment variables (HTTP_PROXY, https_proxy, etc.) to choose and use the proxy.

Unlike many similar packages, this one does not use tunnel in HTTP, like [request](https://github.com/request/request), like browsers.


# Example

```javascript

import fetch from 'fetch-with-proxy';

const url = 'https://nodejs.org/';
fetch(url)
      .then((response) => response.text());
      .then(console.log)
      .catch(console.error)


```

# Installation

With [npm](http://npmjs.org):

    $ npm install fetch-with-proxy

# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ mocha test

# Environment variables 

  * HTTP_PROXY
  * http_proxy
  * HTTPS_PROXY
  * http_proxy

# API Documentation

see https://github.com/matthew-andrews/isomorphic-fetch


# Related projects

* https://github.com/rvagg/through2
* https://github.com/dominictarr/event-stream
* https://github.com/ZJONSSON/streamz
* https://github.com/ZJONSSON/etl
* https://github.com/chbrown/streaming


# License

[MIT/X11](https://github.com/touv/node-ezs/blob/master/LICENSE)

