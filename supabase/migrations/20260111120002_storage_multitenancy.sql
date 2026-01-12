-- ============================================
-- STORAGE MULTI-TENANCY MIGRATION
-- Restricts file access to organization scope
-- Files must be stored at: {org_id}/{filename}
-- ============================================

-- ============================================
-- 1. DROP EXISTING PERMISSIVE POLICIES
-- ============================================

DROP POLICY IF EXISTS "Attachments 1mt4rzk_0" ON storage.objects;
DROP POLICY IF EXISTS "Attachments 1mt4rzk_1" ON storage.objects;
DROP POLICY IF EXISTS "Attachments 1mt4rzk_3" ON storage.objects;

-- ============================================
-- 2. CREATE ORG-SCOPED STORAGE POLICIES
-- Files must be in the format: {org_id}/{filename}
-- ============================================

-- SELECT: Users can only view files in their org's folder
CREATE POLICY "attachments_select_org"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'attachments'
  AND (storage.foldername(name))[1] = public.get_user_organization_id()::text
);

-- INSERT: Users can only upload to their org's folder
CREATE POLICY "attachments_insert_org"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'attachments'
  AND (storage.foldername(name))[1] = public.get_user_organization_id()::text
);

-- UPDATE: Users can only update files in their org's folder
CREATE POLICY "attachments_update_org"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'attachments'
  AND (storage.foldername(name))[1] = public.get_user_organization_id()::text
)
WITH CHECK (
  bucket_id = 'attachments'
  AND (storage.foldername(name))[1] = public.get_user_organization_id()::text
);

-- DELETE: Users can only delete files in their org's folder
CREATE POLICY "attachments_delete_org"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'attachments'
  AND (storage.foldername(name))[1] = public.get_user_organization_id()::text
);

-- ============================================
-- 3. SERVICE ROLE POLICY (for migrations/admin)
-- ============================================

CREATE POLICY "attachments_service_all"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'attachments')
WITH CHECK (bucket_id = 'attachments');

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
-- NOTE: The frontend dataProvider must be updated to
-- prefix file uploads with the organization_id:
-- Upload path: {organization_id}/{random_filename}
-- ============================================
