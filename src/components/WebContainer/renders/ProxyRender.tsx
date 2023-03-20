
import React, { useMemo } from "react";
import { RenderComponentProps, RenderTypes, getRegisteredRender } from "../renderRegistory";

import './HTMLRender/HTMLRender';
import './MarkdownRender/MarkdownRender';
import './RichTextRender/RichTextRender';
import './WebModuleRender/WebModuleRender';


interface ProxyRenderProps extends RenderComponentProps {
  renderType: RenderTypes
}

export function ProxyRender(props: ProxyRenderProps) {
  return useMemo(() => {
    const RenderComponent = getRegisteredRender(props.renderType);

    return (
      <RenderComponent url={props.url}
        onLoad={props.onLoad}
        onError={props.onError}
        onReady={props.onReady} />
    );
  }, [props.url, props.renderType]);
}
