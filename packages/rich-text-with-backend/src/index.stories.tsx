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
              bodyJson: {
                type: 'doc',
                content: [
                  {
                    type: 'paragraph',
                    content: [{ type: 'text', text: 'Mock Content' }],
                  },
                ],
              },
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
  apiKey: '123',
  id: '00000000-0000-0000-0000-000000000000',
  options: {
    language: 'en',
  },
};
