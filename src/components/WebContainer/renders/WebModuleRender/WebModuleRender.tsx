/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { RenderComponentProps, RenderTypes, registerRender } from "../../renderRegistory";
import { useLoadWebModuleRenderState } from "../../hooks/useLoadWebModuleRenderState";

export function WebModuleRender(props: RenderComponentProps) {
  const ref = useLoadWebModuleRenderState(props);
  return (
    <div ref={ref as any} style={{width: "100%", height: "100%"}}/>
  );
}

registerRender(RenderTypes.WebModule, WebModuleRender);
