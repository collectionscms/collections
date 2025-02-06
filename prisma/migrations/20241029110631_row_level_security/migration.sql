-- Enable Row Level Security
ALTER TABLE "Project" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserProject" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "File" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentRevision" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Review" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiKey" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ApiKeyPermission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "WebhookLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TextGenerationUsage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tag" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "ContentTag" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "Project" FORCE ROW LEVEL SECURITY;
ALTER TABLE "UserProject" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Role" FORCE ROW LEVEL SECURITY;
ALTER TABLE "RolePermission" FORCE ROW LEVEL SECURITY;
ALTER TABLE "File" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Post" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ContentRevision" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Content" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Review" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ApiKey" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ApiKeyPermission" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Invitation" FORCE ROW LEVEL SECURITY;
ALTER TABLE "WebhookSetting" FORCE ROW LEVEL SECURITY;
ALTER TABLE "WebhookLog" FORCE ROW LEVEL SECURITY;
ALTER TABLE "TextGenerationUsage" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Tag" FORCE ROW LEVEL SECURITY;
ALTER TABLE "ContentTag" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "Project" USING ("id" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "UserProject" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Role" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "RolePermission" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "File" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Post" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ContentRevision" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Content" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Review" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ApiKey" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ApiKeyPermission" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Invitation" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "WebhookSetting" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "WebhookLog" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "TextGenerationUsage" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Tag" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "ContentTag" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);

-- Create policies to bypass RLS
CREATE POLICY bypass_rls_policy ON "Project" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "UserProject" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Role" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "RolePermission" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "File" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Post" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ContentRevision" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Content" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Review" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ApiKey" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ApiKeyPermission" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Invitation" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "WebhookSetting" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "WebhookLog" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "TextGenerationUsage" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Tag" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "ContentTag" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');