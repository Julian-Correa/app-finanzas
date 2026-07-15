# Supabase Layer

This folder is the only place where Supabase client configuration and database query modules should live.

UI components must not import Supabase directly. Feature hooks and services should depend on typed query/service functions instead.

FinOS v1 does not use Supabase Auth. Supabase is used only as a persistence layer, so query modules must not assume `auth.uid()` or authenticated RLS policies.

Use `src/types/database.ts` for the database contract and keep feature code behind typed query/service functions instead of importing the Supabase client directly.
