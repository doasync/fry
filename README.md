![DoAsync logo](https://leonardo.osnova.io/cf1dd2d1-f854-97b5-4707-406bcbf0d69c)

[![NPM Version][npm-image]][npm-url] ![NPM Downloads][downloads-image] [![GitHub issues][issues-image]][issues-url]

[npm-image]: https://img.shields.io/npm/v/fry.svg
[npm-url]: https://www.npmjs.com/package/fry
[downloads-image]: https://img.shields.io/npm/dw/fry.svg
[deps-image]: https://david-dm.org/doasync/fry.svg
[issues-image]: https://img.shields.io/github/issues/doasync/fry.svg
[issues-url]: https://github.com/doasync/fry/issues

# Benefits over plain `fetch`

- Extended API
- Treats non-2xx status codes as errors
- Handles JSON
- Custom defaults
- Easy interceptors
- Transform function
- And more...

> `fry` is written in TypeScript

---

## Installation

```bash
npm install fry
```

## Description

fry is `fetch` on steroids :)

There are two exports in the package: `request` and `createRequest`

`createRequest` is used to create a `request` with predefined config

The `request` accepts the same params/options as `fetch` as well as additional ones: baseUrl, url, data, params, fn, silent

```md
url - the only required param,
baseUrl - will be prepended to url,
data - object for json body,
params - query as an object,
silent - do not fall on http errors,
fn - preparation of the result (if necessary)
```

`fn` parameters:

```md
request - object of the request,
response - object of the response,
jsonData - parsed json,
config - what was passed to the request
```

There are also basic inteceptors:

```md
onBeforeRequest - change config,
onRequestError - return a new response (or rethrow an error),
onBeforeResponse - do something before response is handled,
onResponseError - return a new response or handle errors,
```

## Usage

```typescript
import { createRequest } from 'fry'; // import { request } from "fry";

const request = createRequest({
  baseUrl: 'https://app.io/api',
  redirect: 'error',
});

export const checkUser = id =>
  request({
    url: 'user',
    method: 'post',
    data: { userId: id }, // json
    fn: ({ jsonData: [user], config }) =>
      Boolean(config.data.userId === user.id && user.exists === true), // return boolean
  });

// No need for async / await
export const submitTransaction = tx =>
  request({
    url: 'transactions',
    method: 'post',
    data: { base64 },
    fn: ({ config, request, response, jsonData, resource, init, baseConfig }) =>
      tx, // returns tx
  });

export const activate = accountId =>
  request({
    url: `accounts/${accountId}`,
    method: 'post',
  }); // returns jsonData if no `fn`

const getAccount = accountId => request(`accounts/${accountId}`); // 'get' method is default

// Using TypeScript

const fetchCountry = async countryId =>
  request(`api/countries/${countryId}`) as Promise<Country>;

const fetchLocations = async () =>
  request<Locations>({
    url: 'api/locations/countries/',
    fn: ({ jsonData }) => convertCountriesToLocations(jsonData as Country[]),
  });
```

### Types

<details>
<summary>
  Config
</summary>

```ts
export type Config<R = unknown> = {
  url?: Url;
  baseUrl?: BaseUrl;
  params?: Params;
  data?: Json;
  fn?: Fn<R>;
  silent?: boolean;
  onBeforeRequest?: (config: Config<R>) => Config<R> | Promise<Config<R>>;
  onRequestError?: (meta: {
    config: Config<R>;
    request: Request;
    error: unknown;
  }) => Response | Promise<Response>;
  onBeforeResponse?: (meta: {
    config: Config<R>;
    response: Response;
    request: Request;
  }) => Response | Promise<Response>;
  onResponseError?: (meta: {
    config: Config<R>;
    response: Response;
    request: Request;
    error: Error;
  }) => Response | Promise<Response>;
} & RequestInit;
```

</details>

<details>
<summary>
  Other
</summary>

```ts
export type Json = JsonPrimitive | JsonObject | JsonArray;
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: Json };
export type JsonArray = Json[];

export type ObjectString = { [key: string]: string };

export type Params = string[][] | ObjectString | string | URLSearchParams;
export type Url = string;
export type BaseUrl = string;

export type Fn<R = unknown> = (meta: {
  config: ConfigFn<R>;
  request: Request;
  response: Response;
  jsonData?: unknown;
}) => R;
```

</details>

### Repository

---

GitHub ★: https://github.com/doasync/fry
