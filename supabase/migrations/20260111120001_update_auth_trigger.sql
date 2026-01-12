-- ============================================
-- UPDATE AUTH TRIGGER FOR MULTI-TENANCY
-- Creates organization when new user signs up
-- ============================================

-- Drop existing trigger first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Replace the handle_new_user function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    new_org_id bigint;
    org_name text;
    org_slug text;
    sales_count_in_org int;
    invited_org_id bigint;
BEGIN
    -- Check if user was invited to an existing organization
    invited_org_id := (new.raw_user_meta_data ->> 'organization_id')::bigint;

    IF invited_org_id IS NOT NULL THEN
        -- User was invited to existing org - join it
        new_org_id := invited_org_id;

        -- Count existing sales in this org to determine if admin
        SELECT count(id) INTO sales_count_in_org
        FROM public.sales
        WHERE organization_id = new_org_id;
    ELSE
        -- New user creating new organization

        -- Generate organization name from user metadata or default
        org_name := COALESCE(
            new.raw_user_meta_data ->> 'organization_name',
            CONCAT(
                COALESCE(new.raw_user_meta_data ->> 'first_name', 'My'),
                '''s Organization'
            )
        );

        -- Generate slug from org name (lowercase, replace spaces with hyphens)
        org_slug := LOWER(
            REGEXP_REPLACE(
                REGEXP_REPLACE(org_name, '[^a-zA-Z0-9\s-]', '', 'g'),
                '\s+', '-', 'g'
            )
        );

        -- Ensure slug is unique by appending random suffix if needed
        org_slug := org_slug || '-' || SUBSTRING(MD5(RANDOM()::text) FROM 1 FOR 6);

        -- Create the new organization
        INSERT INTO public.organizations (name, slug)
        VALUES (org_name, org_slug)
        RETURNING id INTO new_org_id;

        -- First user in new org is always admin
        sales_count_in_org := 0;
    END IF;

    -- Create the sales record linked to the organization
    INSERT INTO public.sales (
        first_name,
        last_name,
        email,
        user_id,
        administrator,
        organization_id
    )
    VALUES (
        new.raw_user_meta_data ->> 'first_name',
        new.raw_user_meta_data ->> 'last_name',
        new.email,
        new.id,
        CASE WHEN sales_count_in_org > 0 THEN FALSE ELSE TRUE END,
        new_org_id
    );

    RETURN new;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- UPDATE init_state VIEW
-- Check if ANY organization exists (for signup flow)
-- This needs security_invoker=off so it works before login
-- ============================================

DROP VIEW IF EXISTS public.init_state;
CREATE VIEW public.init_state
    WITH (security_invoker=off)
    AS
SELECT
    COUNT(id) AS is_initialized
FROM public.organizations
LIMIT 1;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================
