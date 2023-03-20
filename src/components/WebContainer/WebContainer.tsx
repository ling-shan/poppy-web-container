import React, { useEffect, useState } from 'react'
import { getAbsPathURLObject, getPathURLByURLObject } from '../../utils/url'
import { RenderTypes } from './renderRegistory'

import { ProxyRender } from './renders/ProxyRender';

interface WebContainerProps {
  className?: string
  url?: string
  onLoad?: () => void
  onReady?: () => void
  onError?: () => void
}

/**
 * WebContainer is an micro-frontend solution, which is support for mutiple mime type
 *
 * Resource render mapping
 * //xxxxx.html?name=3&page=test -> html render
 * //xxxxx.md | makrdown -> markdown render
 * //xxxxx.assets-manifest.json?xxx  ->
 * //xxxxx.remote-entry.js?xxxx=xxxx
 *
 * @param porps
 * @returns
 */
export function WebContainer(props: WebContainerProps) {
  const [renderType, setRenderType] = useState(RenderTypes.None);

  // detect the render
  useEffect(() => {
    const pathUrl = props.url ? getPathURLByURLObject(getAbsPathURLObject(props.url)) : "";
    if (pathUrl.endsWith(".html")) {
      setRenderType(RenderTypes.HTML);
    } else if (pathUrl.endsWith("asset-manifest.json")) {
      setRenderType(RenderTypes.WebModule);
    } else if (pathUrl.endsWith(".md") || pathUrl.endsWith(".markdown")) {
      setRenderType(RenderTypes.Markdown);
    } else if (pathUrl.endsWith(".rtext")) {
      setRenderType(RenderTypes.RichText);
    } else {
      setRenderType(RenderTypes.None);
    }
  }, [props.url]);

  return (
    <div className={props.className}>
      <ProxyRender
        renderType={renderType}
        url={props.url ?? ""}
        onLoad={props.onLoad}
        onError={props.onError}
        onReady={props.onReady}/>
    </div>
  );
}

