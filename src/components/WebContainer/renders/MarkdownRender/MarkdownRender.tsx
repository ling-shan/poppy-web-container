import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { RenderComponentProps, RenderTypes, registerRender } from '../../renderRegistory';
import { useLoadTextRender } from '../../hooks/useLoadTextRender';

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
export function MarkdownRender(props: RenderComponentProps) {
  const content = useLoadTextRender(props);
  return (
    <ReactMarkdown children={content} remarkPlugins={remarkPlugins}/>
  );
}

registerRender(RenderTypes.Markdown, MarkdownRender);
