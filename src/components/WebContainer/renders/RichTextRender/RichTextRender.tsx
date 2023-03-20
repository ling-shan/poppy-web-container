import { RenderComponentProps, RenderTypes, registerRender } from '../..//renderRegistory';
import { useLoadTextRender } from '../../hooks/useLoadTextRender';
import React from 'react'


export function RichTextRender(props: RenderComponentProps) {
  const content = useLoadTextRender(props);
  return (
    <div dangerouslySetInnerHTML={{__html: content}} />
  );
}

registerRender(RenderTypes.RichText, RichTextRender);

