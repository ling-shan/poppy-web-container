import React, { ElementType, FunctionComponent, ReactNode } from "react";

import './renders/HTMLRender';
import './renders/MarkdownRender';
import './renders/RichTextRender';
import './renders/WebModuleRender';

export const RenderTypes = {
  HTML: "html",
  Markdown: "markdown",
  RichText: "richText",
  WebModule: "webModule",
}

export interface RenderComponentProps {
  url?: string
  loading?: ReactNode
  error?: ReactNode
}

function DefaultRender() {
  return <></>
}

type RenderComponentType = FunctionComponent<RenderComponentProps>;
export type RenderElement = ElementType<RenderComponentProps>;

const renderMapper: Record<string, RenderComponentType> = {} as  any;

export function registerRender(key: string, component: any) {
  renderMapper[key] = component;
}

export function getRegisteredRender(key: string):RenderComponentType {
  return renderMapper[key] ?? DefaultRender;
}
