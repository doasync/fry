import { BaseUrl, Params, Url } from './types';

export const getQueryString = (params: Params): string => {
  const qs = String(new URLSearchParams(params));
  return qs && `?${qs}`;
};

export const getResource = ({
  url,
  baseUrl,
  params,
}: {
  url?: Url;
  baseUrl?: BaseUrl;
  params?: Params;
}): string => {
  const qs = params ? getQueryString(params) : '';
  if (baseUrl && url) {
    return `${baseUrl.replace(/\/$/, '')}/${url.replace(/^\//, '')}${qs}`;
  }
  return `${baseUrl ?? url ?? ''}${qs}`;
};

export const getJson = async <T = unknown>(
  response: Response
): Promise<T | undefined> => {
  try {
    return (await response.json()) as T;
  } catch {
    return undefined;
  }
};
