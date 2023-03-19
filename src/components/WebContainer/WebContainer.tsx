import React, { ReactElement, useEffect, useState } from 'react'
import { getAbsPathURLObject, getPathURLByURLObject } from 'utils/url'
import { RenderComponentProps, RenderTypes, getRegisteredRender } from './renderRegistory'

interface WebContainerProps extends RenderComponentProps {
  className?: string
}

/**
 * WebContainer is an micro-frontend solution, which is support for mutiple mime type
 *
 * Resource render mapping
 * //xxxxx.html?pasdasd&asdasdasd -> html render
 * //xxxxx.md | makrdown -> markdown render
 * //assets-manifest.json?xxx  ->
 * //.remote-entry.js?xxxx=xxxx
 * Steps:
 * 1. loaded the content from the url
 * 2. get the resource type from url suffix or response type(response type has hight priority than url suffix)
 * 3. get the content from the response (like json, mardwon, text context) then set the content to target render
 *
 * Loading Busy Status / Loading Error
 * 1. loading Error State
 * 2. loading busy State
 *
 * @param porps
 * @returns
 */
export function WebContainer(props: WebContainerProps) {
  const [renderContent, setCurrentContent] = useState<ReactElement | null>(null);

  useEffect(() => {
    let renderType = "";

    const pathUrl = getPathURLByURLObject(getAbsPathURLObject(props.url ?? ""));
    if (pathUrl.endsWith(".html")) {
      renderType = RenderTypes.HTML;
    } else if (pathUrl.endsWith("asset-manifest.js")) {
      renderType = RenderTypes.WebModule;
    } else if (pathUrl.endsWith(".md") || pathUrl.endsWith(".markdown")) {
      renderType = RenderTypes.WebModule;
    } else if (pathUrl.endsWith(".rtext")) {
      renderType = RenderTypes.RichText;
    }

    const RenderComponent = getRegisteredRender(renderType);
    setCurrentContent(
      <RenderComponent url={props.url} error={props.error} loading={props.loading} />
    );
  }, [props.url]);

  return (
    <div className={props.className}>
      { renderContent }
    </div>
  );
}

