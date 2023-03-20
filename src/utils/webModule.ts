/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseURL, getAbsURLByBaseURL } from "./url";

type WebModuleInstanceCleanFunction = CallableFunction;

interface WebModuleInstanceFactoryContext {
  webModule: WebModule
  container?: HTMLElement
  params?: Record<string, any>
  [key: string]: any
}

type WebModuleInstanceFactory = (context?: WebModuleInstanceFactoryContext) => Promise<WebModuleInstanceCleanFunction>

interface WebModule {
  publicPath: string;
  moduleName: string;
  factory: WebModuleInstanceFactory | null
}

interface GlobalWebModuleNamespace {
  _: {
    alias: Record<string, string>
    loadings: Record<string, Promise<void> | undefined>
    modules: Record<string, WebModule>
  },
  get(webModuleUrlOrName: string):WebModule | undefined;
}

const globalWebModuleNamespaceName = "webModule";
let globalWebModuleNamespace: GlobalWebModuleNamespace = (window as any)[globalWebModuleNamespaceName];
if (!globalWebModuleNamespace) {
  globalWebModuleNamespace = {
    _: {
      alias: {},
      loadings: {},
      modules: {},
    },
    get(webModuleUrlOrName: string):WebModule | undefined {
      const webModuleName = globalWebModuleNamespace._.alias[webModuleUrlOrName] ?? webModuleUrlOrName;
      return globalWebModuleNamespace._.modules[webModuleName] ?? undefined;
    }
  };
  (window as any)[globalWebModuleNamespaceName] = globalWebModuleNamespace;
}

const webModuleAliasMap = globalWebModuleNamespace._.alias;
const webModuleMap = globalWebModuleNamespace._.modules;
const webModuleLoadedMap = globalWebModuleNamespace._.loadings;

interface AssetAttributes {
  tag: "script" | "link"
  [key: string]: string;
}

async function loadHTMLOrAssetManifest(url: string): Promise<AssetAttributes[]> {
  const responseResult = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache"
    }
  });

  const baseUrl = baseURL(url);

  const contentType = responseResult.headers.get("Content-Type");
  const results: AssetAttributes[] = [];
  // for html
  if (contentType && contentType.includes("text/html")) {
    const htmlContent = await responseResult.text();
    const htmlDoc = new DOMParser().parseFromString(htmlContent, "text/html");
    const scriptList = htmlDoc.querySelectorAll("script[src]");
    scriptList.forEach((element) => {
      const jsElement = (element as HTMLScriptElement);
      results.push({
        tag: "script",
        url: getAbsURLByBaseURL(jsElement.src, baseUrl),
        async: "",
        type: jsElement.type ?? "text/javascript",
        "data-identify": url,
      });
    })

    const cssList = htmlDoc.querySelectorAll('link[rel="stylesheet"]');
    cssList.forEach((element) => {
      results.push({
        tag: "link",
        href: getAbsURLByBaseURL((element as HTMLLinkElement).href, baseUrl),
      });
    })
    return results;
  }

  // for asset-manifest.json
  if (contentType && contentType.includes("application/json")) {
    const jsonContent = await responseResult.json();
    const entrypoints: string[] = jsonContent?.entrypoints ?? [];
    entrypoints.forEach((entrypoint) => {
      const ext = (/\.(css|js)$/.exec(entrypoint) || [])[1];
      const assetsUrl = getAbsURLByBaseURL(entrypoint, baseUrl);
      if (ext === "js") {
        results.push({
          tag: "script",
          url: assetsUrl,
          async: "",
          type: "text/javascript",
          "data-identify": url,
        });
      } else if (ext === "css") {
        results.push({
          tag: "link",
          href: assetsUrl,
        })
      }
    })
    return results;
  }

  throw new Error("InvalidEntry");
}

async function loadJavaScript(asset: AssetAttributes) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script") as HTMLScriptElement;
    script.type = "text/javascript";
    script.async = true;

    script.onerror = (err) => {
      reject(err);
    };
    script.onload = function(){
      resolve(undefined);
    }
    script.src = asset.url;
    script.type = asset.type;
    script.setAttribute("data-identify", asset["data-identify"])
    document.head.appendChild(script);
  })
}

async function loadCss(asset: AssetAttributes) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("link") as HTMLLinkElement;
    script.rel = "stylesheet";
    script.onerror = (err) => {
      reject(err);
    };
    script.onload = function(){
      resolve(undefined);
    }
    script.href = asset["href"];
    document.head.appendChild(script);
  })
}

async function loadWebModule(webModuleUrl: string) {
  const assets = await loadHTMLOrAssetManifest(webModuleUrl);
  for (const asset of assets) {
    // const ext = (/\.(css|js)$/.exec(asset) || [])[1];
    // eslint-disable-next-line no-debugger
    if (asset.tag === "script") {
      await loadJavaScript(asset);
    } else if (asset.tag === "link") {
      await loadCss(asset);
    }
  }
}

function get(webModuleUrlOrName: string) {
  const webModuleName = webModuleAliasMap[webModuleUrlOrName] ?? webModuleUrlOrName;
  return webModuleMap[webModuleName] ?? undefined;
}

export async function importWebModule(webModuleUrl: string, webModuleName?: string): Promise<WebModule> {
  if (webModuleLoadedMap[webModuleUrl]) {
    await webModuleLoadedMap[webModuleUrl];
    return get(webModuleUrl);
  }

  if (webModuleName) {
    webModuleAliasMap[webModuleName] = webModuleUrl;
  }

  const publicPath = baseURL(webModuleUrl);

  const webModule = {
    moduleName: webModuleName ?? webModuleUrl,
    publicPath,
    factory: null,
  };

  webModuleMap[webModuleUrl] = webModule;
  webModuleLoadedMap[webModuleUrl] = loadWebModule(webModuleUrl);
  return webModule;
}

let currentWebModule: WebModule | null;

function initWebModule() {
  let currentScript = document.currentScript;
  if (!currentScript) {
    const scripts = document.querySelectorAll("script");
    if (scripts && scripts.length > 0) {
      currentScript = scripts[scripts.length - 1];
    }
  }

  const webModuleIdentify = currentScript?.getAttribute("data-identify") ?? "";
  if (!webModuleIdentify) {
    return;
  }

  currentWebModule = get(webModuleIdentify) ?? null;
  if (!currentWebModule) {
    return;
  }

  try {
    __webpack_public_path__ = currentWebModule.publicPath ?? "./";
  // eslint-disable-next-line no-empty
  } catch (err) {
  }
}

initWebModule();

export function startWebModule(factory: WebModuleInstanceFactory): void {
  if (!currentWebModule) {
    factory();
    return;
  }
  currentWebModule.factory = factory;
}




