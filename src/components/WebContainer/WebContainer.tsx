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
 *
 * 1. xxxxx.html?name=3&page=test -> html render
 * 2. xxxxx.md | makrdown -> markdown render
 * 3. xxxxx.assets-manifest.json?xxx  ->
 * 4. xxxxx.remote-entry.js?xxxx=xxxx
 *
 * Example:
 *
 * 1. https://oss.hecode.cc/poppy-assets/LongMusicB.html
 * 2. https://oss.hecode.cc/poppy-assets/longMusicB.md
 * 3. https://oss.hecode.cc/poppy-assets/react-app-demo/asset-manifest.json
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

