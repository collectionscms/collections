import { v4 } from 'uuid';
import { WebhookProvider } from '../../../persistence/webhookSetting/webhookSetting.entity.js';

export const webhookSettings = (projectId: string) => {
  const webhookSettings = [
    {
      name: 'On-Demand ISR',
      provider: WebhookProvider.custom,
      projectId,
      enabled: false,
      url: 'https://example.com/api/revalidate',
      secret: v4(),
      requestHeaders: {
        'X-CUSTOM-ON-DEMAND-ISR-KEY': v4(),
      },
      onPublish: true,
      onArchive: true,
      onDeletePublished: true,
    },
    {
      name: 'Vercel deployment',
      provider: WebhookProvider.vercel,
      projectId,
      enabled: false,
      url: 'https://example.com/v1/vercel/deployment',
      secret: null,
      requestHeaders: {},
      onPublish: true,
      onArchive: true,
      onDeletePublished: true,
    },
  ];

  return webhookSettings;
};
