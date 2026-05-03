CREATE OR REPLACE FUNCTION public.get_user_role_by_email(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role FROM public.funcionarios WHERE email = p_email;
  RETURN v_role;
END;
$function$;
