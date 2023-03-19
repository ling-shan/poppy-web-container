import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRenderProps {
  content?: string
}

const remarkPlugins = [
  [remarkGfm, { singleTilde: false }]
] as any;

/**
 *
 * https://github.com/remarkjs/react-markdown
 *
 * @param props
 * @returns
 */
export function MarkdownRender(props: MarkdownRenderProps) {
  return (
    <ReactMarkdown children={props.content ?? ''} remarkPlugins={remarkPlugins}/>
  );
}
