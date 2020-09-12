export type Json = JsonPrimitive | JsonObject | JsonArray;
export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: Json };
export type JsonArray = Json[];

export interface ObjectString {
  [key: string]: string;
}

export type Params = ObjectString | string | URLSearchParams;
export type Url = string;
export type BaseUrl = string;
export type Fn<R = unknown> = (meta: {
  config: ConfigFn<R>;
  request: Request;
  response: Response;
  jsonData?: unknown;
}) => R;

export interface Config<R = unknown> extends ConfigNoFn<R> {
  fn?: Fn<R>;
}

export interface ConfigFn<R = unknown> extends ConfigNoFn<R> {
  fn: Fn<R>;
}

export interface ConfigNoFn<R = unknown> extends RequestInit {
  url?: Url;
  baseUrl?: BaseUrl;
  params?: Params;
  data?: Json;
  silent?: boolean;
  onBeforeRequest?: OnBeforeRequest<R>;
  onRequestError?: OnRequestError<R>;
  onBeforeResponse?: OnBeforeResponse<R>;
  onResponseError?: OnResponseError<R>;
}

export type OnBeforeRequest<R = unknown> = (meta: {
  config: Config<R>;
}) => Config<R> | Promise<Config<R>>;

export type OnRequestError<R = unknown> = (meta: {
  config: Config<R>;
  request: Request;
  error: unknown;
}) => Response | Promise<Response>;

export type OnBeforeResponse<R = unknown> = (meta: {
  config: Config<R>;
  response: Response;
  request: Request;
}) => Response | Promise<Response>;

export type OnResponseError<R = unknown> = (meta: {
  config: Config<R>;
  response: Response;
  request: Request;
  error: Error;
}) => Response | Promise<Response>;
