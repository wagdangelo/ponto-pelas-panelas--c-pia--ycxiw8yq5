-- Migration for Ponto Pelas Panelas

-- Create is_user_admin function first so we can use it in policies
-- Uses SECURITY DEFINER to bypass RLS and prevent infinite recursion
CREATE OR REPLACE FUNCTION public.is_user_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM funcionarios WHERE id = auth.uid() AND role IN ('admin', 'gerente', 'Admin', 'Gerente')
  );
$$;

-- 1. funcionarios
CREATE TABLE IF NOT EXISTS public.funcionarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nome TEXT,
    email TEXT UNIQUE,
    cargo TEXT,
    role TEXT,
    turno TEXT,
    data_admissao DATE,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS nome TEXT;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS email TEXT;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'funcionarios_email_key'
  ) THEN
    ALTER TABLE public.funcionarios ADD CONSTRAINT funcionarios_email_key UNIQUE (email);
  END IF;
END $$;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS cargo TEXT;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS turno TEXT;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS data_admissao DATE;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS ativo BOOLEAN DEFAULT true;
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.funcionarios ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 2. pontos
CREATE TABLE IF NOT EXISTS public.pontos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    data DATE,
    data_hora TIMESTAMPTZ,
    tipo_ponto TEXT,
    horario TEXT,
    foto TEXT,
    localizacao JSONB,
    wifi_validado BOOLEAN,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS data DATE;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS data_hora TIMESTAMPTZ;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS tipo_ponto TEXT;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS horario TEXT;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS foto TEXT;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS localizacao JSONB;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS wifi_validado BOOLEAN;
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.pontos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 3. punch_adjustments
CREATE TABLE IF NOT EXISTS public.punch_adjustments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    punch_date DATE,
    punch_time_in TEXT,
    punch_lunch_out TEXT,
    punch_lunch_in TEXT,
    punch_time_out TEXT,
    justification TEXT,
    status TEXT DEFAULT 'pending',
    nsr SERIAL UNIQUE,
    approved_by UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS punch_date DATE;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS punch_time_in TEXT;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS punch_lunch_out TEXT;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS punch_lunch_in TEXT;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS punch_time_out TEXT;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS justification TEXT;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.punch_adjustments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 4. avisos
CREATE TABLE IF NOT EXISTS public.avisos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT,
    titulo VARCHAR(50),
    descricao VARCHAR(500),
    data DATE,
    funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pendente',
    prazo TEXT,
    criado_por UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL,
    criado_em TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS tipo TEXT;
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS titulo VARCHAR(50);
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS descricao VARCHAR(500);
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS data DATE;
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS funcionario_id UUID REFERENCES public.funcionarios(id) ON DELETE CASCADE;
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pendente';
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS prazo TEXT;
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS criado_por UUID REFERENCES public.funcionarios(id) ON DELETE SET NULL;
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS criado_em TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.avisos ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Enable RLS
ALTER TABLE public.funcionarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pontos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.punch_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avisos ENABLE ROW LEVEL SECURITY;

-- Policies for funcionarios
DROP POLICY IF EXISTS "Funcionários Select" ON public.funcionarios;
CREATE POLICY "Funcionários Select" ON public.funcionarios
  FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Funcionários Update" ON public.funcionarios;
CREATE POLICY "Funcionários Update" ON public.funcionarios
  FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Funcionários Insert" ON public.funcionarios;
CREATE POLICY "Funcionários Insert" ON public.funcionarios
  FOR INSERT TO authenticated
  WITH CHECK (public.is_user_admin());

DROP POLICY IF EXISTS "Funcionários Delete" ON public.funcionarios;
CREATE POLICY "Funcionários Delete" ON public.funcionarios
  FOR DELETE TO authenticated
  USING (public.is_user_admin());

-- Policies for pontos
DROP POLICY IF EXISTS "Pontos Select" ON public.pontos;
CREATE POLICY "Pontos Select" ON public.pontos
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR funcionario_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Pontos Insert" ON public.pontos;
CREATE POLICY "Pontos Insert" ON public.pontos
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR funcionario_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Pontos Update" ON public.pontos;
CREATE POLICY "Pontos Update" ON public.pontos
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR funcionario_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Pontos Delete" ON public.pontos;
CREATE POLICY "Pontos Delete" ON public.pontos
  FOR DELETE TO authenticated
  USING (public.is_user_admin());

-- Policies for punch_adjustments
DROP POLICY IF EXISTS "Ajustes Select" ON public.punch_adjustments;
CREATE POLICY "Ajustes Select" ON public.punch_adjustments
  FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Ajustes Insert" ON public.punch_adjustments;
CREATE POLICY "Ajustes Insert" ON public.punch_adjustments
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Ajustes Update" ON public.punch_adjustments;
CREATE POLICY "Ajustes Update" ON public.punch_adjustments
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Ajustes Delete" ON public.punch_adjustments;
CREATE POLICY "Ajustes Delete" ON public.punch_adjustments
  FOR DELETE TO authenticated
  USING (public.is_user_admin());

-- Policies for avisos
DROP POLICY IF EXISTS "Avisos Select" ON public.avisos;
CREATE POLICY "Avisos Select" ON public.avisos
  FOR SELECT TO authenticated
  USING (funcionario_id = auth.uid() OR public.is_user_admin());

DROP POLICY IF EXISTS "Avisos Insert" ON public.avisos;
CREATE POLICY "Avisos Insert" ON public.avisos
  FOR INSERT TO authenticated
  WITH CHECK (public.is_user_admin());

DROP POLICY IF EXISTS "Avisos Update" ON public.avisos;
CREATE POLICY "Avisos Update" ON public.avisos
  FOR UPDATE TO authenticated
  USING (public.is_user_admin());

DROP POLICY IF EXISTS "Avisos Delete" ON public.avisos;
CREATE POLICY "Avisos Delete" ON public.avisos
  FOR DELETE TO authenticated
  USING (public.is_user_admin());

-- Seed initial user
DO $$
DECLARE
  new_user_id uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'wagner@pelaspanelas.com.br') THEN
    new_user_id := gen_random_uuid();
    INSERT INTO auth.users (
      id, instance_id, email, encrypted_password, email_confirmed_at,
      created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
      is_super_admin, role, aud,
      confirmation_token, recovery_token, email_change_token_new,
      email_change, email_change_token_current,
      phone, phone_change, phone_change_token, reauthentication_token
    ) VALUES (
      new_user_id,
      '00000000-0000-0000-0000-000000000000',
      'wagner@pelaspanelas.com.br',
      crypt('Skip@Pass', gen_salt('bf')),
      NOW(), NOW(), NOW(),
      '{"provider": "email", "providers": ["email"]}',
      '{"name": "Wagner"}',
      false, 'authenticated', 'authenticated',
      '', '', '', '', '', NULL, '', '', ''
    );

    INSERT INTO public.funcionarios (id, email, nome, role, cargo)
    VALUES (new_user_id, 'wagner@pelaspanelas.com.br', 'Wagner', 'admin', 'admin')
    ON CONFLICT (id) DO NOTHING;
  END IF;
END $$;
