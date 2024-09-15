import { WebhookProvider } from '../../../persistence/webhookSetting/webhookSetting.entity.js';

export const webhookSettings = (projectId: string) => {
  const webhookSettings = [
    {
      name: 'On-Demand ISR',
      provider: WebhookProvider.custom,
      projectId,
      enabled: false,
      url: 'https://example.com/api/revalidate',
      onPublish: true,
      onArchive: true,
      onUpdatePublished: true,
      onDeletePublished: true,
    },
    {
      name: 'Vercel deployment',
      provider: WebhookProvider.vercel,
      projectId,
      enabled: false,
      url: 'https://example.com/v1/vercel/deployment',
      onPublish: true,
      onArchive: true,
      onUpdatePublished: true,
      onDeletePublished: true,
    },
  ];

  return webhookSettings;
};
