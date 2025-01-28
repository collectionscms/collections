import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import React from 'react';
import { RichText } from './index';

export default {
  title: 'Components/RichText',
  component: RichText,
  parameters: {
    msw: {
      handlers: [
        http.get('https://en.collections.dev/api/v1/contents/:contentId', () => {
          return HttpResponse.json({
            content: {
              bodyHtml: '<p>Try out the editor to see how smooth it feels to write! 😎🖊️</p>',
            },
          });
        }),
        http.post('https://en.collections.dev/api/v1/contents', () => {
          return HttpResponse.json({
            content: {
              id: '00000000-0000-0000-0000-000000000000',
            },
          });
        }),
        http.put('https://en.collections.dev/api/v1/contents/:contentId', () => {
          return HttpResponse.json({});
        }),
      ],
    },
  },
} as Meta<typeof RichText>;

const Template: StoryFn<typeof RichText> = (args) => <RichText {...args} />;

export const Default = Template.bind({});
Default.args = {
  projectId: 'en',
  apiKey: 'bd7ef64b-dc9b-4d42-a486-df1ebd69fe1b',
  // updateContentId: '9cd888ee-f57a-4995-a9e4-ddbffd80ade8',
  // updateDraftKey: '2fbee1357f',
};
