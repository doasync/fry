![DoAsync logo](https://leonardo.osnova.io/cf1dd2d1-f854-97b5-4707-406bcbf0d69c)

[![NPM Version][npm-image]][npm-url] ![NPM Downloads][downloads-image] [![GitHub issues][issues-image]][issues-url]

[npm-image]: https://img.shields.io/npm/v/fry.svg
[npm-url]: https://www.npmjs.com/package/fry
[downloads-image]: https://img.shields.io/npm/dw/fry.svg
[deps-image]: https://david-dm.org/doasync/fry.svg
[issues-image]: https://img.shields.io/github/issues/doasync/fry.svg
[issues-url]: https://github.com/doasync/fry/issues

Benefits over plain `fetch`
===================

Extended API
Treats non-2xx status codes as errors
Handles JSON
Custom defaults
And more...

----------

Installation
-------------

```bash
npm install fry
```

Usage
-------------------

```javascript
export const checkUser = (id) =>
  request({
    url: ENDPOINT.user(),
    method: "post",
    data: { userId: id }, // json
    fn: ({ jsonData: [user], config }) =>
      Boolean(config.data.userId === user.id && user.exists === true), // return boolean
  });

// No need for async / await
export const submitTransaction = (tx) =>
  request({
    url: ENDPOINT.transactions(),
    method: "post",
    data: { base64 },
    fn: ({ config, request, response, jsonData, resource, init, baseConfig }) => tx, // returns tx
  });

export const activate = (accountId) =>
  request({
    url: ENDPOINT.activate(accountId),
    method: "post",
  }); // returns jsonData if no `fn`

```

### Repo
------------------

GitHub ★: https://github.com/doasyc/fry
