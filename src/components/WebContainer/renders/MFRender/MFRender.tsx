import React, { useState, useEffect } from "react";
import {
  loadDep,
  loadModule,
  isMf,
  loadMfModule,
  isValidComponent,
} from "./utils";

export interface MFRenderProps {
  /** 资源地址，js/css */
  url: string | string[];

  /** 组件名，
   * MF："scope/module"
   * UMD："globalVar"
   *  */
  componentName: string;

  /** 开启资源跨域，用于监控js报错 */
  crossOrigin?: false | "anonymous" | "use-credentials";

  /** MF模块的共享实例 */
  scopes?: Record<string, any>;
}

export function MFRender({
  children,
  url,
  crossOrigin = false,
  componentName,
  scopes,
  ...rest
}: React.PropsWithChildren<MFRenderProps>) {
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [ComponentRef, setComponentRef] = useState<{
    value?: React.ComponentType;
  }>(() => {
    const module = loadModule(componentName);
    // 避免函数被转为元素
    return {
      value: isValidComponent(module) ? module : undefined,
    };
  });
  const { value: Component } = ComponentRef;

  useEffect(() => {
    setLoading(true);
    setErrorMsg(null);
    loadDep(url, { crossOrigin })
      .then((res) => {
        const hasLoadError =
          Array.isArray(res) && res.some((item) => item.status === "error");
        if (hasLoadError) {
          throw new Error("url load fail.");
        }
        setLoaded(true);
      })
      .catch((error) => {
        setLoaded(false);
        setLoading(false);
        setErrorMsg(error.message);
      });
  }, [url, crossOrigin]);

  useEffect(() => {
    if (!loaded) return;
    (async () => {
      try {
        if (!componentName) {
          throw new Error("componentName is empty.");
        }
        let module;
        const isMfModule = isMf(componentName);
        if (isMfModule) {
          setLoading(true);
          setErrorMsg(null);
          // scope/module
          module = await loadMfModule(componentName, scopes);
        } else {
          // globalVar
          module = loadModule(componentName);
        }
        if (isValidComponent(module)) {
          setLoading(false);
          setComponentRef({
            value: module,
          });
        } else {
          throw new Error(
            `componentName: "${componentName}", target is not a valid component.`
          );
        }
      } catch (error: any) {
        setLoading(false);
        setErrorMsg(error.message);
      }
    })();
  }, [loaded, componentName, scopes]);

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
