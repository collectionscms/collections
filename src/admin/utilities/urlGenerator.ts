export const getLoginUrl = () => {
  return generateUrlWithCurrentDomain('/admin/auth/login');
};

export const getMeUrl = () => {
  return generateUrlWithCurrentDomain('/admin/me');
};

export const getUrlForTenant = (subdomain: string, path: string) => {
  return generateUrlWithCurrentDomain(path, subdomain);
};

const generateUrlWithCurrentDomain = (path: string, subdomain?: string) => {
  const { protocol, hostname, port } = window.location;
  const domain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${subdomain ? `${subdomain}.` : ''}${domain}${port ? `:${port}` : ''}${path}`;
};
