/// <reference types="react-scripts" />

declare module "*.module.css" {
  const content: Record<string, string>;
  export default content;
}
