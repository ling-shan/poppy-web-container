import { RenderComponentProps, RenderTypes, registerRender } from 'components/WebContainer/renderRegistory';
import { useLoadTextRender } from 'components/WebContainer/useLoadTextRender';
import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
    <ReactMarkdown children={renderState.state.content ?? ''} remarkPlugins={remarkPlugins}/>
  );
}

registerRender(RenderTypes.Markdown, MarkdownRender);
