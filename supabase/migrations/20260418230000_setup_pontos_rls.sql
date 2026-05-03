DO $$
BEGIN
  -- RLS setup for pontos table
  ALTER TABLE public.pontos ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "authenticated_delete_pontos" ON public.pontos;
  DROP POLICY IF EXISTS "authenticated_insert_pontos" ON public.pontos;
  DROP POLICY IF EXISTS "authenticated_select_pontos" ON public.pontos;
  DROP POLICY IF EXISTS "authenticated_update_pontos" ON public.pontos;
  
  DROP POLICY IF EXISTS "pontos_select_own" ON public.pontos;
  DROP POLICY IF EXISTS "pontos_insert_own" ON public.pontos;
  DROP POLICY IF EXISTS "pontos_update_own" ON public.pontos;
  DROP POLICY IF EXISTS "pontos_delete_own" ON public.pontos;

  CREATE POLICY "pontos_select_own" ON public.pontos
    FOR SELECT TO authenticated
    USING (funcionario_id = auth.uid());

  CREATE POLICY "pontos_insert_own" ON public.pontos
    FOR INSERT TO authenticated
    WITH CHECK (funcionario_id = auth.uid());

  CREATE POLICY "pontos_update_own" ON public.pontos
    FOR UPDATE TO authenticated
    USING (funcionario_id = auth.uid())
    WITH CHECK (funcionario_id = auth.uid());

  CREATE POLICY "pontos_delete_own" ON public.pontos
    FOR DELETE TO authenticated
    USING (funcionario_id = auth.uid());
END $$;

-- Create storage bucket if not exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('pontos', 'pontos', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Set up storage policies
DO $$
BEGIN
  DROP POLICY IF EXISTS "Give public access to pontos" ON storage.objects;
  CREATE POLICY "Give public access to pontos" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'pontos');

  DROP POLICY IF EXISTS "Allow authenticated uploads to pontos" ON storage.objects;
  CREATE POLICY "Allow authenticated uploads to pontos" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'pontos');
END $$;
