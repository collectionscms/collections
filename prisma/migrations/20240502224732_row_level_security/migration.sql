-- Enable Row Level Security
ALTER TABLE "Role" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Permission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "File" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Post" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "PostHistory" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Content" ENABLE ROW LEVEL SECURITY;

-- Force Row Level Security for table owners
ALTER TABLE "Role" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Permission" FORCE ROW LEVEL SECURITY;
ALTER TABLE "File" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Post" FORCE ROW LEVEL SECURITY;
ALTER TABLE "PostHistory" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Content" FORCE ROW LEVEL SECURITY;

-- Create row security policies
CREATE POLICY tenant_isolation_policy ON "Role" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Permission" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "File" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Post" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "PostHistory" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);
CREATE POLICY tenant_isolation_policy ON "Content" USING ("projectId" = current_setting('app.current_project_id', TRUE)::uuid);

-- Create policies to bypass RLS
CREATE POLICY bypass_rls_policy ON "Role" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Permission" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "File" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Post" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "PostHistory" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
CREATE POLICY bypass_rls_policy ON "Content" USING (current_setting('app.bypass_rls', TRUE)::text = 'on');
