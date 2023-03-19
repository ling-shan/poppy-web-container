import React, { useState, useEffect } from "react";
import {
  loadDep,
  loadModule,
  isValidComponent,
  isMf,
  loadMfModule,
} from "./utils";

export interface MFRenderProps {
  /** 资源地址，js/css */
  url: string | string[];
  /** 用于监控报错，非必须 */
  crossOrigin?: false | "anonymous" | "use-credentials";
  /** 组件名，
   * MF："name/module"
   * UMD："globalVar"
   *  */
  componentName: string;
}

export function MFRender({
  children,
  url,
  crossOrigin = false,
  componentName,
  ...rest
}: React.PropsWithChildren<MFRenderProps>) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ComponentRef, setComponentRef] = useState<{
    value?: React.ComponentType;
  }>({
    value: loadModule(componentName),
  });
  const { value: Component } = ComponentRef;

  useEffect(() => {
    if (isValidComponent(Component)) {
      return;
    }
    setLoading(true);
    setErrorMsg(null);
    loadDep(url, { crossOrigin })
      .then(() => {
        if (isMf(componentName)) {
          loadMfModule(componentName).then((module) => {
            setLoading(false);
            setComponentRef({
              value: module,
            });
          });
          return;
        }
        const module = loadModule(componentName);
        setLoading(false);
        setComponentRef({
          value: module,
        });
      })
      .catch((error) => {
        setLoading(false);
        setErrorMsg(error.message);
      });
  }, [Component, componentName, url]);

  if (loading) return <span>loading...</span>;

  if (errorMsg || !Component) {
    return (
      <span style={{ color: "red", padding: "0 5px" }}>
        {errorMsg ||
          (componentName
            ? `${componentName} load fail`
            : "componentName is empty")}
      </span>
    );
  }

  return React.createElement(Component, rest, children);
}
