import React from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WebContainer } from './WebContainer'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'WebContaner',
  component: WebContainer,
} as ComponentMeta<typeof WebContainer>;

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: ComponentStory<typeof WebContainer> = (args) => <WebContainer {...args} />;

export const Primary = Template.bind({});
Primary.args = {
};
