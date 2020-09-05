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

export type GetResourceConfig = {
  url?: Url;
  baseUrl?: BaseUrl;
  params?: Params;
};

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

export type ConfigFn<R = unknown> = {
  url?: Url;
  baseUrl?: BaseUrl;
  params?: Params;
  data?: Json;
  fn: Fn<R>;
  silent?: boolean;
  onBeforeRequest?: (config: Config<R>) => Config<R> | Promise<Config<R>>;
  onRequestError?: (error: unknown) => Response | Promise<Response>;
  onBeforeResponse?: (response: Response) => Response | Promise<Response>;
  onResponseError?: (error: Error) => Response | Promise<Response>;
} & RequestInit;

export type ConfigNoFn<R = unknown> = {
  url?: Url;
  baseUrl?: BaseUrl;
  params?: Params;
  data?: Json;
  silent?: boolean;
  onBeforeRequest?: (config: Config<R>) => Config<R> | Promise<Config<R>>;
  onRequestError?: (error: unknown) => Response | Promise<Response>;
  onBeforeResponse?: (response: Response) => Response | Promise<Response>;
  onResponseError?: (error: Error) => Response | Promise<Response>;
} & RequestInit;
