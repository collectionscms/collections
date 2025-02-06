-- Enable Row Level Security
ALTER TABLE "UserExperience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Experience" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ExperienceResource" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "UserExperience" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Experience" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ExperienceResource" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "UserExperience" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Experience" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ExperienceResource" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);

-- Create policies to bypass RLS
CREATE POLICY bypass_rls_policy ON "UserExperience" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Experience" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ExperienceResource" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');