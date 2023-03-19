/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* eslint-disable */
export const judgeUrl = (str) => {
  let itemArr = str.split("/");
  let lastItem = itemArr.length - 1;
  itemArr = itemArr[lastItem];
  itemArr = itemArr.split(".");
  lastItem = itemArr.length - 1;
  const fileType = itemArr.length > 1 ? itemArr[lastItem] : "";
  const fileName =
    itemArr.length > 2 ? itemArr.splice(0, lastItem).join(".") : itemArr[0];
  return { fileType, fileName, url: str };
};

const awaitCallbakList = [];

/**
 * 并行加载指定的脚本或css样式
 * 并行加载[同步]同时加载，不管上个是否加载完成，直接加载全部
 * 全部加载完成后执行回调
 * @param array|string 指定的脚本们
 * @param function 成功后回调的函数
 */

const loadFile = (files, callback, errorCallback, isDelete, crossOrigin) => {
  if (!files || !files[0]) {
    throw Error("url is empty.");
  }
  let fileList = files;
  if (typeof files === "string") {
    fileList = [files];
  }
  fileList = fileList.filter(
    (item) => item.endsWith("css") || item.endsWith("js")
  );
  const countInfo = {
    rest: fileList.length,
    skip: 0,
  };
  const resList = [];
  const HEAD =
    document.getElementsByTagName("head").item(0) || document.documentElement;
  const loadOnChange = (item, index, fileType, link) => (e) => {
    if (
      !item.readyState ||
      item.readyState === "loaded" ||
      item.readyState === "complete"
    ) {
      item.onload = null;
      item.onreadystatechange = null;
      item.onerror = null;
      if (isDelete && fileType !== "css") {
        item.parentNode.removeChild(item);
      }
      countInfo.rest -= 1;
      resList.push({
        event: e,
        link,
        status: "success",
      });
      if (countInfo.rest <= 0 && typeof callback === "function") {
        callback(resList);
      }

      if (awaitCallbakList.length) {
        const delIndex = awaitCallbakList.findIndex((item) => {
          if (item.link === link) {
            item.fn.apply(null, item.args);
            return true;
          }
        });
        if (delIndex !== -1) {
          awaitCallbakList.splice(delIndex, 1);
        }
      }
    }
  };
  const loadOnError = (item, index, fileType, link) => (e) => {
    if (e.type === "error") {
      item.parentNode.removeChild(item);
      countInfo.rest -= 1;
      resList.push({
        event: e,
        link,
        status: "error",
      });

      if (typeof errorCallback === "function") errorCallback(resList);
      if (countInfo.rest <= 0 && typeof callback === "function") {
        callback(resList);
        awaitCallbakList.forEach((item) => {
          item.fn.apply(null, item.args);
        });
        awaitCallbakList.length = 0;
      }
    }
  };
  fileList.forEach((link, index) => {
    let { fileType, fileName } = judgeUrl(link);
    fileType = fileType.split("?")[0];
    const tagMapping = {
      js: "script",
      css: "link",
    };
    const typeMapping = {
      js: "javascript",
      css: "css",
    };
    const attrMapping = {
      js: "src",
      css: "href",
    };
    if (!tagMapping[fileType]) return;
    const item = document.createElement(tagMapping[fileType]);
    const idName = fileName + "." + fileType;
    if (typeMapping[fileType] === "css") {
      item.rel = "stylesheet";
    }

    if (typeMapping[fileType] === "javascript" && crossOrigin) {
      item.crossOrigin = crossOrigin;
    }

    const el = document.getElementById(idName);
    if (el) {
      countInfo.skip += 1;
      awaitCallbakList.push({
        fn: () => {
          countInfo.rest -= 1;
          resList.push({
            event: null,
            link,
            status: "skip",
          });
          if (countInfo.rest <= 0 && typeof callback === "function") {
            callback(resList);
          }
        },
        args: [],
        link,
      });
      return;
    }

    item.setAttribute("id", idName);
    item.setAttribute("type", `text/${typeMapping[fileType]}`);
    item.onload = loadOnChange(item, index, fileType, link); // ff
    item.onreadystatechange = loadOnChange(item, index, fileType, link); // ie
    item.onerror = loadOnError(item, index, fileType, link);
    item.setAttribute(attrMapping[fileType], link);
    HEAD.appendChild(item);
  });
};

export const loadDep = (
  files,
  options: {
    callback?: (e) => void;
    errorCallback?: (e) => void;
    loadDelete?: boolean;
    crossOrigin?: false | "anonymous" | "use-credentials";
  } = {
    callback: (e) => void 0,
    errorCallback: (e) => void 0,
    loadDelete: false,
    crossOrigin: false,
  }
) => {
  return new Promise((reslove, reject) => {
    try {
      loadFile(
        files,
        (e) => {
          if (typeof callback === "function") {
            options?.callback(e);
          }
          reslove(e);
        },
        (e) => {
          if (typeof errorCallback === "function") {
            options?.errorCallback(e);
          }
          reslove(e);
        },
        options.loadDelete,
        options.crossOrigin
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * takePathValue 通过属性值定位对象指定值
 * @param {object | Array} target
 * @param {string | Array} path
 * 例: const obj = { a: { b:1 } }
 * takePathValue(obj,'a.b')
 * takePathValue(obj,['a','b'])
 */
export const takePathValue = (target, path) => {
  let targetVal = target;
  let propPaths = [];
  if (Array.isArray(path)) {
    propPaths = path;
  }
  if (typeof path === "string") {
    const pathSplit = path.split(".");
    if (pathSplit.length > 1) {
      propPaths = pathSplit;
    } else {
      propPaths = [path];
    }
  }
  try {
    propPaths.length > 0 &&
      propPaths.filter(Boolean).forEach((prop) => {
        if (targetVal !== undefined && targetVal !== null) {
          targetVal = targetVal[prop];
        } else {
          throw new Error();
        }
      });
  } catch (error) {}
  return targetVal;
};

export const loadModule = (name, target = window) => {
  if (!name) return;
  const module = takePathValue(target, name);
  return module?.default || module;
};

export const isMf = (name) => {
  const namePaths = name.split("/");
  return namePaths.length >= 2;
};

export const getMfInfo = (name) => {
  let mfInfo = null;
  if (name.includes("/")) {
    const namePaths = name.split("/");
    if (namePaths.length >= 2) {
      const modulePath = namePaths.slice(1).join("/");
      mfInfo = {
        scope: namePaths[0],
        module: `./${modulePath}`,
      };
    }
  }
  return mfInfo as null | { scope: string; module: string };
};

export const loadMfModule = (name, target = window): Promise<any> => {
  return new Promise((rs, rj) => {
    const mfInfo = getMfInfo(name);
    const mfVar = target[mfInfo?.scope] as
      | undefined
      | {
          get(module): Promise<() => any>;
        };
    if (mfVar && typeof mfVar.get === "function") {
      mfVar
        .get(mfInfo?.module)
        .then((factory) => {
          const module = factory();
          rs(module?.default || module);
        })
        .catch(rj);
    }
  });
};

export const isValidComponent = (target: any) => {
  // @ts-ignore
  // function component
  if (typeof target === "function") return true;
  // class component
  if (target?.prototype?.isReactComponent) return true;
  // forwardRef/memo component
  if (
    ["Symbol(react.forward_ref)", "Symbol(react.memo)"].includes(
      target?.$$typeof?.toString()
    )
  )
    return true;
  return false;
};
