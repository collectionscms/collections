import { Project } from '@prisma/client';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Row } from 'react-table';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { EnabledDot } from '../../components/elements/EnabledDot/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { getUrlForTenant } from '../../utilities/urlGenerator.js';
import { ProjectListContextProvider, useProjectList } from './Context/index.js';

const ProjectListPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getMyProjects } = useProjectList();
  const { data: projectRoles } = getMyProjects();
  const projects = projectRoles.map((pr) => pr.project);

  const columns = useMemo(
    () => [
      {
        id: 'name',
        Header: t('name'),
        accessor: 'name',
        Cell: ({ row }: { row: Row }) => {
          const project = row.original as Project;
          return <Link href={getUrlForTenant(project.subdomain, '/admin')}>{project.name}</Link>;
        },
      },
      {
        id: 'subdomain',
        Header: t('project_id'),
        accessor: 'subdomain',
      },
      {
        id: 'enabled',
        Header: t('status'),
        accessor: 'enabled',
        Cell: ({ row }: { row: Row }) => {
          const project = row.original as Project;
          return <EnabledDot enabled={project.enabled} />;
        },
      },
    ],
    []
  );

  return (
    <>
      <MainCard content={false} title={<></>} secondary={<></>}>
        <ScrollX>
          <ReactTable columns={columns} data={projects} />
        </ScrollX>
      </MainCard>
    </>
  );
};

export const ProjectListPage = ComposeWrapper({ context: ProjectListContextProvider })(
  ProjectListPageImpl
);
