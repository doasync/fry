import { Config, ConfigFn, ConfigNoFn, Url } from './types';
import { getJson, getResource } from './utils';

const RESPONSE_ERROR = 'ResponseError';

export const isResponseError = (error: Error): boolean =>
  error.name === RESPONSE_ERROR;

const contentTypeJson = { 'Content-Type': 'application/json' };

export const createRequest = <
  T = unknown,
  B extends ConfigFn<T> | ConfigNoFn<T> = ConfigFn<T> | ConfigNoFn<T>
>(
  baseConfig?: B
): {
  <R = unknown>(customConfig: ConfigFn<R>): Promise<R>;
  (customConfig: ConfigNoFn<T> | Url): Promise<
    B extends ConfigFn<infer X> ? X : unknown
  >;
} => async <R = unknown>(
  customConfig: ConfigFn<R> | ConfigNoFn<T> | Url
): Promise<R | (B extends ConfigFn<infer X> ? X : unknown) | undefined> => {
  if (typeof customConfig === 'string') {
    customConfig = { url: customConfig };
  }

  let initPromise = Promise.resolve();
  let config = { ...baseConfig, ...customConfig } as Config<R>;

  if (config.onBeforeRequest) {
    try {
      config = await config.onBeforeRequest(config);
    } catch (error) {
      initPromise = Promise.reject(error);
    }
  }

  const {
    url,
    baseUrl,
    params,
    data,
    fn,
    silent,
    onBeforeRequest,
    onRequestError,
    onBeforeResponse,
    onResponseError,
    ...init
  } = config;

  if (data) {
    Object.assign(init, {
      headers: { ...contentTypeJson, ...init.headers },
      body: JSON.stringify(data),
    });
  }

  const request = new Request(getResource({ url, baseUrl, params }), init);

  const handleResponseErrors = async (response: Response) => {
    if (!response.ok) {
      const error = new Error(response.statusText);
      error.name = RESPONSE_ERROR;

      if (onResponseError) {
        return onResponseError({ config, request, response, error });
      }

      return Promise.reject(error);
    }

    return response;
  };

  let promise = initPromise.then(async () => fetch(request));

  if (onRequestError) {
    promise = promise.catch((error: unknown) => {
      return onRequestError({ config, request, error });
    });
  }

  if (onBeforeResponse) {
    promise = promise.then(response => {
      return onBeforeResponse({ config, request, response });
    });
  }

  if (!silent) {
    promise = promise.then(handleResponseErrors);
  }

  return promise.then(async response => {
    const jsonData = await getJson<R>(response);
    return fn
      ? fn({
          config: config as ConfigFn<R>,
          request,
          response,
          jsonData,
        })
      : jsonData;
  });
};

export const request = createRequest();
export const fry = createRequest();
