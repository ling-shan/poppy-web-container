
interface WebContainerProps {
  url?: string | null
}

/**
 * WebContainer is an micro-frontend solution, which is support for mutiple mime type
 *
 * //xxxxx.html -> iframe render
 * //xxxxx.md | makrdown -> markdown render
 * //xxxxx.json  -> dynamic render schema we can decide the final render continer when the json schema loaded so it's dynamic.
 *
 * steps:
 * 1. loaded the content from the url
 * 2. get the resource type from url suffix or response type(response type has hight priority than url suffix)
 * 3. get he content from the url (json, mardwon, text context) then set the content to target render, eg, iframe' srcdoc
 *
 * @param porps
 * @returns
 */
export function WebContainer(props: WebContainerProps) {
  return (
    <>
    hello
    </>
  );
}

