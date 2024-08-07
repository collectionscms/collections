import { Button, Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2.js';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MainCard } from '../../../@extended/components/MainCard/index.js';
import { ComposeWrapper } from '../../../components/utilities/ComposeWrapper/index.js';
import { getUrlForTenant } from '../../../utilities/urlGenerator.js';
import { ProjectContextProvider } from '../Context/index.js';
import { PrimaryLocaleData, PrimaryLocaleForm } from './PrimaryLocaleForm.js';
import { ProjectData, ProjectSettingsForm } from './ProjectSettingsForm.js';

const getStepContent = (
  step: number,
  handleNext: () => void,
  handleBack: () => void,
  projectData: ProjectData,
  primaryLocaleData: PrimaryLocaleData,
  setProjectData: (p: ProjectData) => void,
  setPrimaryLocaleData: (l: PrimaryLocaleData) => void
) => {
  switch (step) {
    case 0:
      return (
        <ProjectSettingsForm
          handleNext={handleNext}
          projectData={projectData}
          setProjectData={setProjectData}
        />
      );
    case 1:
      return (
        <PrimaryLocaleForm
          handleNext={handleNext}
          handleBack={handleBack}
          projectData={projectData}
          primaryLocaleData={primaryLocaleData}
          setPrimaryLocaleData={setPrimaryLocaleData}
        />
      );
    default:
      throw new Error('Unknown step');
  }
};

const CreateProjectPageImpl: React.FC = () => {
  const { t } = useTranslation();

  // /////////////////////////////////////
  // Stepper
  // /////////////////////////////////////
  const steps = [t('project_setting'), t('select_primary_language')];

  const [activeStep, setActiveStep] = useState(0);
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    subdomain: '',
  });
  const [primaryLocaleData, setPrimaryLocaleData] = useState<PrimaryLocaleData>({
    primaryLocale: '',
  });

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleRedirect = () => {
    window.location.href = getUrlForTenant(projectData.subdomain, '/admin');
  };

  return (
    <>
      <Grid container spacing={2.5} justifyContent="center">
        <Grid xs={12} lg={7}>
          <MainCard>
            <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length ? (
              <>
                <Typography variant="h5" gutterBottom>
                  {t('project_created')}
                </Typography>
                <Stack direction="row" justifyContent="center" sx={{ mt: 6 }}>
                  <Button variant="contained" onClick={handleRedirect}>
                    {t('go_to_project_home')}
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                {getStepContent(
                  activeStep,
                  handleNext,
                  handleBack,
                  projectData,
                  primaryLocaleData,
                  setProjectData,
                  setPrimaryLocaleData
                )}
              </>
            )}
          </MainCard>
        </Grid>
      </Grid>
    </>
  );
};

export const CreateProjectPage = ComposeWrapper({ context: ProjectContextProvider })(
  CreateProjectPageImpl
);
