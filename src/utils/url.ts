const PathReg = /^(?:\/*)([^/].*)$/;

export function concatPaths(...segments: string[]) {
  let result = segments[0];
  for (let i = 1; i < segments.length; i++) {
    if (!result.endsWith("/")) {
      result += "/";
    }
    /* istanbul ignore next */
    result += (PathReg.exec(segments[i]) || [])[1] || "";
  }
  return result;
}

export function urlSearchParamsToObject(searchParams: URLSearchParams, blockList?: Record<string, true>) {
  const results: Record<string, string> = {};
  for (const [key, value] of searchParams) {
    if (blockList && blockList[key]) {
      continue;
    }
    results[key] = value;
  }
  return results;
}

export function getConcatURLObject(url: string, baseURL: string) {
  return new URL((url), baseURL).href;
}

export function baseURL(url: string) {
  return new URL("./", getAbsURLObject(url)).href;
}

export function isAbsURL(url: string)  {
  if (url.startsWith("http://")) {
    return true;
  }

  if (url.startsWith("//")) {
    return true;
  }

  return false;
}

export function getAbsURLByBaseURL(url: string, baseUrl: string) {
  const baseUrlOb = getAbsURLObject(baseUrl);
  const urlObj = getAbsURLObject(url);
  return new URL(concatPaths(baseUrlOb.pathname, urlObj.pathname), baseUrlOb).href;
}

export function getAbsURLObject(url: string) {
  return new URL((url), location.origin + location.pathname)
}

export function getPathURLByURLObject(url: URL) {
  return url.origin + url.pathname
}
