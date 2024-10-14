export const getLoginUrl = () => {
  return generateUrlWithCurrentDomain(
    '/admin/auth/login',
    process.env.PUBLIC_PORTAL_SUBDOMAIN as string
  );
};

export const getAddNewProjectUrl = () => {
  return generateUrlWithCurrentDomain(
    '/admin/projects/create',
    process.env.PUBLIC_PORTAL_SUBDOMAIN as string
  );
};

export const getMeUrl = () => {
  return generateUrlWithCurrentDomain('/admin/me', process.env.PUBLIC_PORTAL_SUBDOMAIN as string);
};

export const getProjectListUrl = () => {
  return generateUrlWithCurrentDomain('/admin', process.env.PUBLIC_PORTAL_SUBDOMAIN as string);
};

export const getUrlForTenant = (subdomain: string, path: string) => {
  return generateUrlWithCurrentDomain(path, subdomain);
};

const generateUrlWithCurrentDomain = (path: string, subdomain: string) => {
  const { protocol, hostname, port } = window.location;
  const domain = hostname.split('.').slice(-2).join('.');
  return `${protocol}//${subdomain ? `${subdomain}.` : ''}${domain}${port ? `:${port}` : ''}${path}`;
};
