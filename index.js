'use strict';

const queryString = (params) => {
  const qs = String(new URLSearchParams(params));
  return qs ? `?${qs}` : "";
};

const joinBase = (url, baseUrl) =>
  `${baseUrl.replace(/\/$/, "")}/${url.replace(/^\/|\/$/, "")}/`;

const contentTypeJson = { "Content-Type": "application/json" };

const createRequest = (baseConfig) => (customConfig) => {
  const config = { ...baseConfig, ...customConfig };
  const { baseUrl, url, data, params, fn, silent, ...init } = config;
  const resource = `${joinBase(url, baseUrl)}${queryString(params)}`;

  if (data) {
    Object.assign(init, {
      headers: { ...contentTypeJson, ...config.headers },
      body: JSON.stringify(data),
    });
  }

  const request = new Request(resource, init);

  const handleRequestErrors = (response) => {
    if (!response.ok) {
      const error = Error(response.statusText);
      Object.assign(error, { response, config, request });
      throw error;
    }
    return response;
  };

  return fetch(request)
    .then(!silent ? handleRequestErrors : (x) => x)
    .then(async (response) => {
      let jsonData;
      try {
        jsonData = await response.json();
      } catch (error) {
        /* skip */
      }
      return fn
        ? fn({ config, request, response, jsonData, resource, init, baseConfig })
        : jsonData;
    });
};

const request = createRequest();

module.exports = { request, createRequest};
