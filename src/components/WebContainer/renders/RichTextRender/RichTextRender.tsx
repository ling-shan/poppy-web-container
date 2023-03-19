import { RenderComponentProps, RenderTypes, registerRender } from 'components/WebContainer/renderRegistory';
import { useLoadTextRender } from 'components/WebContainer/useLoadTextRender';
import React from 'react'


export function RichTextRender(props: RenderComponentProps) {
  const renderState = useLoadTextRender(props);

  if (renderState.state.loading) {
    return props.loading;
  }

  if (renderState.state.error) {
    return props.error;
  }

  if (!renderState.state.content) {
    return null;
  }

  return (
    <div dangerouslySetInnerHTML={{__html: renderState.state.content ?? ''}} />
  );
}

registerRender(RenderTypes.RichText, RichTextRender);

