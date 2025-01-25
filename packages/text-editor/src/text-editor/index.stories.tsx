import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { TextEditor } from './index';

export default {
  title: 'Components/TextEditor',
  component: TextEditor,
} as Meta<typeof TextEditor>;

const Template: StoryFn<typeof TextEditor> = (args) => <TextEditor {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectId: '123',
  slug: 'example',
  apiKey: '123',
  options: {
    language: 'en',
  },
};
