/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef } from "react";
import { getPathURLByURLObject, getAbsPathURLObject, urlSearchParamsToObject } from "../../../../utils/url";
import { importWebModule } from "../../../../utils/webModule";
import { RenderComponentProps, RenderTypes, registerRender } from "components/WebContainer/renderRegistory";
import { useRenderState } from "components/WebContainer/useRenderState";

interface WebModuleRenderProps extends RenderComponentProps {
  className?: string
}

export function WebModuleRender(props: WebModuleRenderProps) {
  const ref = useRef<HTMLElement>();
  const renderState = useRenderState();

  useEffect(() => {
    if (!props.url) {
      renderState.setState({
        loading: false,
        error: false,
        content: null
      })
      return;
    }

    if (!ref.current) {
      return;
    }

    const container = ref.current as HTMLElement;
    let webModuleInstClean: CallableFunction | null = null;
    // load and create an instance.
    (async () => {
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
          renderState.setState({
            loading: false,
            error: false,
            content: null
          })
        }
      } catch(err) {
        renderState.setState({
          loading: false,
          error: true,
          content: null
        })
      }
    })();
    return () => {
      webModuleInstClean?.();
    }
  }, [props.url])

  if (renderState.state.loading) {
    return props.loading;
  }

  if (renderState.state.error) {
    return props.error;
  }

  return (
    <div ref={ref as any} className={props.className}/>
  );
}

registerRender(RenderTypes.Markdown, WebModuleRender);
