CREATE TABLE IF NOT EXISTS public.punch_adjustments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE NOT NULL,
  punch_date DATE NOT NULL,
  punch_time_in TIME,
  punch_lunch_out TIME,
  punch_lunch_in TIME,
  punch_time_out TIME,
  justification TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  nsr BIGSERIAL UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ
);

ALTER TABLE public.punch_adjustments ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS "Usuário pode ver suas próprias solicitações, admin todas" ON public.punch_adjustments;
  CREATE POLICY "Usuário pode ver suas próprias solicitações, admin todas" ON public.punch_adjustments
    FOR SELECT TO authenticated
    USING (
      user_id = auth.uid() OR
      EXISTS (
        SELECT 1 FROM public.funcionarios
        WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente')
      )
    );

  DROP POLICY IF EXISTS "Usuário pode criar solicitações" ON public.punch_adjustments;
  CREATE POLICY "Usuário pode criar solicitações" ON public.punch_adjustments
    FOR INSERT TO authenticated
    WITH CHECK (user_id = auth.uid());

  DROP POLICY IF EXISTS "Admin pode atualizar status" ON public.punch_adjustments;
  CREATE POLICY "Admin pode atualizar status" ON public.punch_adjustments
    FOR UPDATE TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.funcionarios
        WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente')
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.funcionarios
        WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente')
      )
    );
END $$;
