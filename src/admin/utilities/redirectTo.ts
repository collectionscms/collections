export const redirectPathToMain = (path: string) => {
  const { protocol, hostname, port } = window.location;
  const domain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${domain}${port ? `:${port}` : ''}${path}`;
};

export const redirectPathToTenant = (subdomain: string, path: string) => {
  const { protocol, hostname, port } = window.location;
  const domain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${subdomain}.${domain}${port ? `:${port}` : ''}${path}`;
};
