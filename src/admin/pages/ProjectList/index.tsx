import { Project } from '@prisma/client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { Cell } from '../../components/elements/Table/Cell/index.js';
import { cells } from '../../components/elements/Table/Cell/types.js';
import { Table } from '../../components/elements/Table/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { buildColumns } from '../../utilities/buildColumns.js';
import { getUrlForTenant } from '../../utilities/urlGenerator.js';
import { ProjectListContextProvider, useProjectList } from './Context/index.js';

const ProjectListPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getMyProjects } = useProjectList();
  const { data: projectRoles } = getMyProjects();
  const projects = projectRoles.map((pr) => pr.project);

  const fields = [
    { field: 'name', label: t('project_name'), type: cells.text() },
    { field: 'subdomain', label: t('project_id'), type: cells.text() },
    { field: 'enabled', label: t('valid'), type: cells.text() },
  ];

  const columns = buildColumns(fields, (i: number, row: Project, data: any) => {
    const defaultCell = <Cell colIndex={i} type={fields[i].type} cellData={data} />;

    switch (fields[i].field) {
      case 'name':
        return <Link href={getUrlForTenant(row.subdomain, '/admin')}>{defaultCell}</Link>;
      default:
        return defaultCell;
    }
  });

  return (
    <>
      <MainCard content={false} title={<></>} secondary={<></>}>
        <Table columns={columns} rows={projects} />
      </MainCard>
    </>
  );
};

export const ProjectListPage = ComposeWrapper({ context: ProjectListContextProvider })(
  ProjectListPageImpl
);
