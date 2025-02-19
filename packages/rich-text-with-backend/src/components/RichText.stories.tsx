import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { RichText } from './RichText';

export default {
  title: 'Components/RichText',
  component: RichText,
} as Meta<typeof RichText>;

const Template: StoryFn<typeof RichText> = (args) => <RichText {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialContent: '',
  options: {
    language: 'ja',
  },
};
