export const getLoginUrl = () => {
  return generateUrlWithCurrentDomain('/admin/auth/login');
};

export const getLogoutUrl = () => {
  return generateUrlWithCurrentDomain('/admin/auth/logout');
};

export const getPathToTenant = (subdomain: string, path: string) => {
  return generateUrlWithCurrentDomain(path, subdomain);
};

const generateUrlWithCurrentDomain = (path: string, subdomain?: string) => {
  const { protocol, hostname, port } = window.location;
  const domain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${subdomain ? `${subdomain}.` : ''}${domain}${port ? `:${port}` : ''}${path}`;
};
