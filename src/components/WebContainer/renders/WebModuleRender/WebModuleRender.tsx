/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { getPathURLByURLObject, getAbsURLObject, urlSearchParamsToObject } from "../../../../utils/url";
import { importWebModule } from "../../../../utils/webModule";

interface WebModuleRenderProps {
  className?: string
  url?: string,
}

export function WebModuleRender(props: WebModuleRenderProps) {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    if (!props.url) {
      return;
    }

    const container = ref.current as HTMLElement;
    let webModuleInstClean: CallableFunction | null = null;
    // load and create an instance.
    (async () => {
      try {
        const targetUrl =  getAbsURLObject(props.url as string);
        const targetUrlSearchParams = urlSearchParamsToObject(targetUrl.searchParams);
        const webModuleUrl = getPathURLByURLObject(targetUrl);
        const webModule = await importWebModule(webModuleUrl);
        if (typeof webModule.factory === "function") {
          webModuleInstClean = await webModule.factory({
            container,
            webModule,
            params: targetUrlSearchParams
          })
        }``
      } catch(err) {
        console.error("webModule Load Error", err);
      }
    })();
    return () => {
      webModuleInstClean?.();
    }
  }, [])

  return (
    <div ref={ref as any} className={props.className}/>
  );
}
