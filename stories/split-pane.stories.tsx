/* eslint-disable unicorn/prevent-abbreviations */
import { ComponentMeta, ComponentStory } from '@storybook/react';

import SplitPane from '../src';

export default {
  title: 'SplitPane',
  component: SplitPane,
  args: {},
} as ComponentMeta<typeof SplitPane>;

const Template: ComponentStory<typeof SplitPane> = (args) => (
  <SplitPane {...args}>
    <div>Pane 1</div>
    <div>Pane 2</div>
  </SplitPane>
);

export const Default = Template.bind({});

export const VerticalSplit = Template.bind({});
VerticalSplit.args = {
  vertical: true,
};
