-- This is an empty migration.-- Enable Row Level Security
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "File" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiKeyPermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TranslationUsage" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;
ALTER TABLE "UserProject" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Role" FORCE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" FORCE ROW LEVEL SECURITY;
ALTER TABLE "File" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Post" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ContentHistory" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Content" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Review" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ApiKey" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ApiKeyPermission" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" FORCE ROW LEVEL SECURITY;
ALTER TABLE "TranslationUsage" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "Project" USING ("id" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "UserProject" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Role" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "RolePermission" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "File" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Post" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ContentHistory" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Content" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Review" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ApiKey" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ApiKeyPermission" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Invitation" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "TranslationUsage" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);

-- Create policies to bypass RLS
CREATE POLICY bypass_rls_policy ON "Project" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "UserProject" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Role" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "RolePermission" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "File" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Post" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ContentHistory" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Content" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Review" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ApiKey" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ApiKeyPermission" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Invitation" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "TranslationUsage" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
