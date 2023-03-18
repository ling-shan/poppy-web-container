import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';

import { WebModuleRender } from './WebModuleRender';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'Example/WebModuleRender',
  component: WebModuleRender,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as ComponentMeta<typeof WebModuleRender>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WebModuleRender> = (args) => <WebModuleRender {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
