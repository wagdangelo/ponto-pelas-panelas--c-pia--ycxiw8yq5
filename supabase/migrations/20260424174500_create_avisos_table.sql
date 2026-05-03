CREATE TABLE IF NOT EXISTS public.avisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL CHECK (tipo IN ('informativo', 'tarefa_dia', 'tarefa_principal')),
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    data DATE NOT NULL,
    funcionario_id UUID NOT NULL REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_progresso', 'concluida')),
    prazo TEXT NOT NULL DEFAULT 'unica',
    criado_por UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "avisos_select_policy" ON public.avisos;
CREATE POLICY "avisos_select_policy" ON public.avisos
    FOR SELECT TO authenticated
    USING (
        funcionario_id = auth.uid() OR 
        criado_por = auth.uid() OR 
        EXISTS (SELECT 1 FROM public.funcionarios WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente'))
    );

DROP POLICY IF EXISTS "avisos_insert_policy" ON public.avisos;
CREATE POLICY "avisos_insert_policy" ON public.avisos
    FOR INSERT TO authenticated
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.funcionarios WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente'))
    );

DROP POLICY IF EXISTS "avisos_update_policy" ON public.avisos;
CREATE POLICY "avisos_update_policy" ON public.avisos
    FOR UPDATE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.funcionarios WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente'))
    )
    WITH CHECK (
        EXISTS (SELECT 1 FROM public.funcionarios WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente'))
    );

DROP POLICY IF EXISTS "avisos_delete_policy" ON public.avisos;
CREATE POLICY "avisos_delete_policy" ON public.avisos
    FOR DELETE TO authenticated
    USING (
        EXISTS (SELECT 1 FROM public.funcionarios WHERE id = auth.uid() AND role IN ('Admin', 'Gerente', 'admin', 'gerente'))
    );
