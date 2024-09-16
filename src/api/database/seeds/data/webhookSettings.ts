import { WebhookProvider } from '../../../persistence/webhookSetting/webhookSetting.entity.js';

export const webhookSettings = (projectId: string) => {
  const webhookSettings = [
    {
      name: 'On-Demand ISR',
      provider: WebhookProvider.custom,
      projectId,
      enabled: false,
      url: 'http://localhost:3000/api/revalidate',
      onPublish: true,
      onArchive: true,
      onDeletePublished: true,
      onRestorePublished: true,
    },
    {
      name: 'Vercel deployment',
      provider: WebhookProvider.vercel,
      projectId,
      enabled: false,
      url: 'https://example.com/v1/vercel/deployment',
      onPublish: true,
      onArchive: true,
      onDeletePublished: true,
      onRestorePublished: true,
    },
  ];

  return webhookSettings;
};
