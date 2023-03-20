import { useEffect, useRef } from "react";

import { RenderComponentProps } from "../renderRegistory";
import { getPathURLByURLObject, getAbsPathURLObject, urlSearchParamsToObject } from "../../../utils/url";
import { importWebModule } from "../../../utils/webModule";

export function useLoadWebModuleRenderState(props: RenderComponentProps) {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const container = ref.current as HTMLElement;
    let webModuleInstClean: CallableFunction | null = null;
    // load and create an instance.
    (async () => {
      props.onLoad?.();
      try {
        const targetUrl =  getAbsPathURLObject(props.url as string);
        const targetUrlSearchParams = urlSearchParamsToObject(targetUrl.searchParams);
        const webModuleUrl = getPathURLByURLObject(targetUrl);
        const webModule = await importWebModule(webModuleUrl);
        if (typeof webModule.factory === "function") {
          webModuleInstClean = await webModule.factory({
            container,
            webModule,
            params: targetUrlSearchParams
          })
          props.onReady?.();
        }
      } catch(err) {
        props.onError?.();
      }
    })();
    return () => {
      webModuleInstClean?.();
    }
  }, [props.url])

  return ref;
}
