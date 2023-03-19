import React from 'react';

interface HTMLRenderProps {
  content?: string
}

export function HTMLRender(props: HTMLRenderProps) {
  return (
    <iframe
      srcDoc={props.content}
    />
  );
}
