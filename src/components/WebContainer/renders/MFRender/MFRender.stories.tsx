import React from "react";
import * as Antd from "antd";
import { ComponentStory, ComponentMeta } from "@storybook/react";

import { MFRender } from "./MFRender";

export default {
  title: "Example/MFRender",
  component: MFRender,
} as ComponentMeta<typeof MFRender>;

const Template: ComponentStory<typeof MFRender> = (args) => {
  return <MFRender {...args} />;
};

export const Primary = Template.bind({});
Primary.args = {
  url: "https://ether21.surge.sh/remoteEntry.js",
  componentName: "pages/page1",
  scopes: {
    react: {
      "17.0.2": {
        get: () => () => React,
      },
    },
    antd: {
      "5.3.1": {
        get: () => () => Antd,
      },
    },
  },
};
