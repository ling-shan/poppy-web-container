import React from 'react'

interface RichTextRenderProps {
  content?: string
}

export function RichTextRender(props: RichTextRenderProps) {
  return (
    <div>
      <div dangerouslySetInnerHTML={{__html: props.content ?? ''}} />
    </div>
  );
}
