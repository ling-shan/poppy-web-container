
interface WebContainerPorps {
  url?: string | null
}

/**
 * WebContainer is an micro-frontend solution, which is support for mutiple mime type
 *
 * //xxxxx.html -> iframe render
 * //xxxxx.md | makrdown -> markdown render
 * //xxxxx.json  -> dynamic render schema we can decide the final render continer when the json schema loaded so it's dynamic.
 *
 * @param porps
 * @returns
 */
export function WebContainer(props: WebContainerPorps) {
  return (
    <>
    hello
    </>
  );
}

