# FinOS Database Package

This package contains the Phase 2 Supabase/PostgreSQL schema for FinOS.

Execution order:

1.  `001_extensions.sql`
2.  `002_enums.sql`
3.  `003_tables.sql`
4.  `004_indexes.sql`
5.  `005_constraints.sql`
6.  `006_functions.sql`
7.  `007_triggers.sql`
8.  `008_views.sql`
9.  `009_rls.sql`
10. `010_seed.sql`

`schema.sql` uses `psql`/Supabase CLI `\ir` includes to execute the scripts in order.

Execution options:

1.  With `psql`: run `psql "<SUPABASE_DB_URL>" -f 04_Database/schema.sql` from the project root.
2.  With Supabase CLI: link a fresh project, then execute the files in the order above.
3.  With Supabase SQL Editor: paste and run each numbered SQL file manually in the order above. The SQL Editor does not support the `\ir` directives in `schema.sql`.

Current local environment note:

-   `psql` and Supabase CLI are not installed on this machine, so runtime validation must happen after one of those tools is installed or through the Supabase dashboard.

Security model:

-   No Supabase Auth in v1.
-   Supabase is used only for persistence.
-   RLS policies allow anonymous client read/write access required by the no-auth app.
-   `profile_id` is an application filter, not a database security boundary.
