const API_SCHEME = 'http';
const API_ORIGIN = 'test.com:4000';
const BASE_URL = (path: string, projectId: string) =>
  `${API_SCHEME}://${projectId}.${API_ORIGIN}/api/v1/${path}`;

export async function fetchContent(
  projectId: string,
  contentId: string,
  apiKey: string,
  draftKey: string | null
) {
  const url = `${BASE_URL('contents', projectId)}/${contentId}${draftKey ? `?draftKey=${draftKey}` : ''}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return response.json();
}

export async function createContent(projectId: string, apiKey: string) {
  const url = `${BASE_URL('posts', projectId)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  return response.json();
}

export async function updateContent(
  projectId: string,
  contentId: string,
  apiKey: string,
  data: {
    body: string | null;
    bodyHtml: string | null;
    bodyJson: string | null;
  }
) {
  const url = `${BASE_URL('contents', projectId)}/${contentId}`;
  await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}
