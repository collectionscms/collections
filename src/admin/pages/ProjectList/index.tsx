import { Button, Stack, Typography } from '@mui/material';
import { Project } from '@prisma/client';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Row } from 'react-table';
import { MainCard } from '../../@extended/components/MainCard/index.js';
import { CreateNewButton } from '../../components/elements/CreateNewButton/index.js';
import { EnabledDot } from '../../components/elements/EnabledDot/index.js';
import { Icon } from '../../components/elements/Icon/index.js';
import { Link } from '../../components/elements/Link/index.js';
import { ReactTable } from '../../components/elements/ReactTable/index.js';
import { ScrollX } from '../../components/elements/ScrollX/index.js';
import { ComposeWrapper } from '../../components/utilities/ComposeWrapper/index.js';
import { getUrlForTenant } from '../../utilities/urlGenerator.js';
import { ProjectListContextProvider, useProjectList } from './Context/index.js';

const ProjectListPageImpl: React.FC = () => {
  const { t } = useTranslation();
  const { getMyProjects } = useProjectList();
  const navigate = useNavigate();
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
        width: 40,
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
      <MainCard
        content={false}
        title={<></>}
        secondary={
          <CreateNewButton
            onClick={() => navigate('projects/create')}
            options={{
              subject: t('create_project'),
            }}
          />
        }
      >
        <ScrollX>
          <ReactTable
            columns={columns}
            data={projects}
            emptyComponent={
              <>
                <Typography align="center" variant="h5" sx={{ py: 2 }}>
                  {t('create_your_first_project')}
                </Typography>
                <Button variant="contained" onClick={() => navigate('projects/create')}>
                  <Stack direction="row" alignItems="center" gap={0.5}>
                    <Icon name="Plus" size={14} />
                    {t('create_project')}
                  </Stack>
                </Button>
              </>
            }
          />
        </ScrollX>
      </MainCard>
    </>
  );
};

export const ProjectListPage = ComposeWrapper({ context: ProjectListContextProvider })(
  ProjectListPageImpl
);
