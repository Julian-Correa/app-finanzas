# Supabase Layer

This folder is the only place where Supabase client configuration and database query modules should live.

UI components must not import Supabase directly. Feature hooks and services should depend on typed query/service functions instead.

The authentication/RLS model is still an open architectural decision because product documentation says no authentication while database documentation requires authenticated RLS policies.
