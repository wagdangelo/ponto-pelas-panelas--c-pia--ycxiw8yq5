// AVOID UPDATING THIS FILE DIRECTLY. It is automatically generated.
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      avisos: {
        Row: {
          criado_em: string | null
          criado_por: string | null
          data: string | null
          descricao: string | null
          funcionario_id: string | null
          id: string
          prazo: string | null
          status: string | null
          tipo: string | null
          titulo: string | null
          updated_at: string | null
        }
        Insert: {
          criado_em?: string | null
          criado_por?: string | null
          data?: string | null
          descricao?: string | null
          funcionario_id?: string | null
          id?: string
          prazo?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          updated_at?: string | null
        }
        Update: {
          criado_em?: string | null
          criado_por?: string | null
          data?: string | null
          descricao?: string | null
          funcionario_id?: string | null
          id?: string
          prazo?: string | null
          status?: string | null
          tipo?: string | null
          titulo?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avisos_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "avisos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      funcionarios: {
        Row: {
          ativo: boolean | null
          bairro: string | null
          cargo: string | null
          cep: string | null
          cidade: string | null
          complemento: string | null
          cpf: string | null
          created_at: string | null
          data_admissao: string | null
          data_nascimento: string | null
          documentos: Json | null
          email: string | null
          foto_url: string | null
          horarios: Json | null
          id: string
          nome: string | null
          numero: string | null
          role: string | null
          rua: string | null
          salario_base: number | null
          status: string | null
          telefone: string | null
          tipo_contrato: string | null
          turno: string | null
          updated_at: string | null
        }
        Insert: {
          ativo?: boolean | null
          bairro?: string | null
          cargo?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          data_nascimento?: string | null
          documentos?: Json | null
          email?: string | null
          foto_url?: string | null
          horarios?: Json | null
          id: string
          nome?: string | null
          numero?: string | null
          role?: string | null
          rua?: string | null
          salario_base?: number | null
          status?: string | null
          telefone?: string | null
          tipo_contrato?: string | null
          turno?: string | null
          updated_at?: string | null
        }
        Update: {
          ativo?: boolean | null
          bairro?: string | null
          cargo?: string | null
          cep?: string | null
          cidade?: string | null
          complemento?: string | null
          cpf?: string | null
          created_at?: string | null
          data_admissao?: string | null
          data_nascimento?: string | null
          documentos?: Json | null
          email?: string | null
          foto_url?: string | null
          horarios?: Json | null
          id?: string
          nome?: string | null
          numero?: string | null
          role?: string | null
          rua?: string | null
          salario_base?: number | null
          status?: string | null
          telefone?: string | null
          tipo_contrato?: string | null
          turno?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pontos: {
        Row: {
          criado_em: string | null
          data: string | null
          data_hora: string | null
          entrada: string | null
          foto: string | null
          foto_url: string | null
          funcionario_id: string | null
          horario: string | null
          id: string
          latitude: number | null
          localizacao: Json | null
          longitude: number | null
          nsr: number
          status_validacao: string | null
          tipo_ponto: string | null
          updated_at: string | null
          user_id: string | null
          wifi_conectado: boolean | null
          wifi_validado: boolean | null
        }
        Insert: {
          criado_em?: string | null
          data?: string | null
          data_hora?: string | null
          entrada?: string | null
          foto?: string | null
          foto_url?: string | null
          funcionario_id?: string | null
          horario?: string | null
          id?: string
          latitude?: number | null
          localizacao?: Json | null
          longitude?: number | null
          nsr?: number
          status_validacao?: string | null
          tipo_ponto?: string | null
          updated_at?: string | null
          user_id?: string | null
          wifi_conectado?: boolean | null
          wifi_validado?: boolean | null
        }
        Update: {
          criado_em?: string | null
          data?: string | null
          data_hora?: string | null
          entrada?: string | null
          foto?: string | null
          foto_url?: string | null
          funcionario_id?: string | null
          horario?: string | null
          id?: string
          latitude?: number | null
          localizacao?: Json | null
          longitude?: number | null
          nsr?: number
          status_validacao?: string | null
          tipo_ponto?: string | null
          updated_at?: string | null
          user_id?: string | null
          wifi_conectado?: boolean | null
          wifi_validado?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pontos_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pontos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      pontos_diarios: {
        Row: {
          created_at: string
          data: string
          entrada: string | null
          funcionario_id: string
          id: string
          retorno_almoco: string | null
          saida: string | null
          saida_almoco: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          entrada?: string | null
          funcionario_id: string
          id?: string
          retorno_almoco?: string | null
          saida?: string | null
          saida_almoco?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          entrada?: string | null
          funcionario_id?: string
          id?: string
          retorno_almoco?: string | null
          saida?: string | null
          saida_almoco?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pontos_diarios_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
      punch_adjustments: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string | null
          data: string | null
          funcionario_id: string | null
          horario_solicitado: string | null
          id: string
          justification: string | null
          motivo: string | null
          nsr: number
          punch_date: string | null
          punch_lunch_in: string | null
          punch_lunch_out: string | null
          punch_time_in: string | null
          punch_time_out: string | null
          status: string | null
          tipo_ponto: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          data?: string | null
          funcionario_id?: string | null
          horario_solicitado?: string | null
          id?: string
          justification?: string | null
          motivo?: string | null
          nsr?: number
          punch_date?: string | null
          punch_lunch_in?: string | null
          punch_lunch_out?: string | null
          punch_time_in?: string | null
          punch_time_out?: string | null
          status?: string | null
          tipo_ponto?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string | null
          data?: string | null
          funcionario_id?: string | null
          horario_solicitado?: string | null
          id?: string
          justification?: string | null
          motivo?: string | null
          nsr?: number
          punch_date?: string | null
          punch_lunch_in?: string | null
          punch_lunch_out?: string | null
          punch_time_in?: string | null
          punch_time_out?: string | null
          status?: string | null
          tipo_ponto?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "punch_adjustments_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "punch_adjustments_funcionario_id_fkey"
            columns: ["funcionario_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "punch_adjustments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "funcionarios"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_user_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const


// ====== DATABASE EXTENDED CONTEXT (auto-generated) ======
// This section contains actual PostgreSQL column types, constraints, RLS policies,
// functions, triggers, indexes and materialized views not present in the type definitions above.
// IMPORTANT: The TypeScript types above map UUID, TEXT, VARCHAR all to "string".
// Use the COLUMN TYPES section below to know the real PostgreSQL type for each column.
// Always use the correct PostgreSQL type when writing SQL migrations.

// --- COLUMN TYPES (actual PostgreSQL types) ---
// Use this to know the real database type when writing migrations.
// "string" in TypeScript types above may be uuid, text, varchar, timestamptz, etc.
// Table: avisos
//   id: uuid (not null, default: gen_random_uuid())
//   tipo: text (nullable)
//   titulo: character varying (nullable)
//   descricao: character varying (nullable)
//   data: date (nullable)
//   funcionario_id: uuid (nullable)
//   status: text (nullable, default: 'pendente'::text)
//   prazo: text (nullable)
//   criado_por: uuid (nullable)
//   criado_em: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
// Table: funcionarios
//   id: uuid (not null)
//   nome: text (nullable)
//   email: text (nullable)
//   cargo: text (nullable)
//   role: text (nullable)
//   turno: text (nullable)
//   data_admissao: date (nullable)
//   ativo: boolean (nullable, default: true)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   data_nascimento: date (nullable)
//   cpf: text (nullable)
//   telefone: text (nullable)
//   cep: text (nullable)
//   rua: text (nullable)
//   numero: text (nullable)
//   complemento: text (nullable)
//   bairro: text (nullable)
//   cidade: text (nullable)
//   salario_base: numeric (nullable)
//   tipo_contrato: text (nullable)
//   status: text (nullable, default: 'Ativo'::text)
//   horarios: jsonb (nullable, default: '{}'::jsonb)
//   documentos: jsonb (nullable, default: '{}'::jsonb)
//   foto_url: text (nullable)
// Table: pontos
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   funcionario_id: uuid (nullable)
//   data: date (nullable)
//   data_hora: timestamp with time zone (nullable)
//   tipo_ponto: text (nullable)
//   horario: text (nullable)
//   foto: text (nullable)
//   localizacao: jsonb (nullable)
//   wifi_validado: boolean (nullable)
//   criado_em: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   entrada: text (nullable)
//   foto_url: text (nullable)
//   latitude: double precision (nullable)
//   longitude: double precision (nullable)
//   status_validacao: text (nullable)
//   wifi_conectado: boolean (nullable)
//   nsr: bigint (not null, default: nextval('pontos_nsr_seq'::regclass))
// Table: pontos_diarios
//   id: uuid (not null, default: gen_random_uuid())
//   funcionario_id: uuid (not null)
//   data: date (not null)
//   entrada: text (nullable)
//   saida_almoco: text (nullable)
//   retorno_almoco: text (nullable)
//   saida: text (nullable)
//   created_at: timestamp with time zone (not null, default: now())
//   updated_at: timestamp with time zone (not null, default: now())
// Table: punch_adjustments
//   id: uuid (not null, default: gen_random_uuid())
//   user_id: uuid (nullable)
//   punch_date: date (nullable)
//   punch_time_in: text (nullable)
//   punch_lunch_out: text (nullable)
//   punch_lunch_in: text (nullable)
//   punch_time_out: text (nullable)
//   justification: text (nullable)
//   status: text (nullable, default: 'pending'::text)
//   nsr: integer (not null, default: nextval('punch_adjustments_nsr_seq'::regclass))
//   approved_by: uuid (nullable)
//   approved_at: timestamp with time zone (nullable)
//   created_at: timestamp with time zone (nullable, default: now())
//   updated_at: timestamp with time zone (nullable, default: now())
//   funcionario_id: uuid (nullable)
//   data: date (nullable)
//   tipo_ponto: text (nullable)
//   horario_solicitado: text (nullable)
//   motivo: text (nullable)

// --- CONSTRAINTS ---
// Table: avisos
//   FOREIGN KEY avisos_criado_por_fkey: FOREIGN KEY (criado_por) REFERENCES funcionarios(id) ON DELETE SET NULL
//   FOREIGN KEY avisos_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY avisos_pkey: PRIMARY KEY (id)
// Table: funcionarios
//   UNIQUE funcionarios_cpf_key: UNIQUE (cpf)
//   UNIQUE funcionarios_email_key: UNIQUE (email)
//   FOREIGN KEY funcionarios_id_fkey: FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE
//   PRIMARY KEY funcionarios_pkey: PRIMARY KEY (id)
// Table: pontos
//   FOREIGN KEY pontos_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   UNIQUE pontos_nsr_key: UNIQUE (nsr)
//   PRIMARY KEY pontos_pkey: PRIMARY KEY (id)
//   FOREIGN KEY pontos_user_id_fkey: FOREIGN KEY (user_id) REFERENCES funcionarios(id) ON DELETE CASCADE
// Table: pontos_diarios
//   UNIQUE pontos_diarios_funcionario_id_data_key: UNIQUE (funcionario_id, data)
//   FOREIGN KEY pontos_diarios_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id) ON DELETE CASCADE
//   PRIMARY KEY pontos_diarios_pkey: PRIMARY KEY (id)
// Table: punch_adjustments
//   FOREIGN KEY punch_adjustments_approved_by_fkey: FOREIGN KEY (approved_by) REFERENCES funcionarios(id) ON DELETE SET NULL
//   FOREIGN KEY punch_adjustments_funcionario_id_fkey: FOREIGN KEY (funcionario_id) REFERENCES funcionarios(id)
//   UNIQUE punch_adjustments_nsr_key: UNIQUE (nsr)
//   PRIMARY KEY punch_adjustments_pkey: PRIMARY KEY (id)
//   FOREIGN KEY punch_adjustments_user_id_fkey: FOREIGN KEY (user_id) REFERENCES funcionarios(id) ON DELETE CASCADE

// --- ROW LEVEL SECURITY POLICIES ---
// Table: avisos
//   Policy "Avisos Delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: is_user_admin()
//   Policy "Avisos Insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_user_admin()
//   Policy "Avisos Select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((funcionario_id = auth.uid()) OR is_user_admin())
//   Policy "Avisos Update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: is_user_admin()
// Table: funcionarios
//   Policy "Funcionários Delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: is_user_admin()
//   Policy "Funcionários Insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: is_user_admin()
//   Policy "Funcionários Select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((id = auth.uid()) OR is_user_admin())
//   Policy "Funcionários Update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((id = auth.uid()) OR is_user_admin())
// Table: pontos
//   Policy "Pontos Delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: is_user_admin()
//   Policy "Pontos Insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((user_id = auth.uid()) OR (funcionario_id = auth.uid()) OR is_user_admin())
//   Policy "Pontos Select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (funcionario_id = auth.uid()) OR is_user_admin())
//   Policy "Pontos Update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR (funcionario_id = auth.uid()) OR is_user_admin())
// Table: pontos_diarios
//   Policy "pontos_diarios_all" (ALL, PERMISSIVE) roles={authenticated}
//     USING: is_user_admin()
//   Policy "pontos_diarios_select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((funcionario_id = auth.uid()) OR is_user_admin())
// Table: punch_adjustments
//   Policy "Ajustes Delete" (DELETE, PERMISSIVE) roles={authenticated}
//     USING: is_user_admin()
//   Policy "Ajustes Insert" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((user_id = auth.uid()) OR is_user_admin())
//   Policy "Ajustes Insert Funcionario" (INSERT, PERMISSIVE) roles={authenticated}
//     WITH CHECK: ((funcionario_id = auth.uid()) OR is_user_admin())
//   Policy "Ajustes Select" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_user_admin())
//   Policy "Ajustes Select Funcionario" (SELECT, PERMISSIVE) roles={authenticated}
//     USING: ((funcionario_id = auth.uid()) OR is_user_admin())
//   Policy "Ajustes Update" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((user_id = auth.uid()) OR is_user_admin())
//   Policy "Ajustes Update Funcionario" (UPDATE, PERMISSIVE) roles={authenticated}
//     USING: ((funcionario_id = auth.uid()) OR is_user_admin())

// --- DATABASE FUNCTIONS ---
// FUNCTION is_user_admin()
//   CREATE OR REPLACE FUNCTION public.is_user_admin()
//    RETURNS boolean
//    LANGUAGE sql
//    SECURITY DEFINER
//    SET search_path TO 'public'
//   AS $function$
//     SELECT EXISTS (
//       SELECT 1 FROM funcionarios WHERE id = auth.uid() AND role IN ('admin', 'gerente', 'Admin', 'Gerente')
//     );
//   $function$
//   
// FUNCTION rls_auto_enable()
//   CREATE OR REPLACE FUNCTION public.rls_auto_enable()
//    RETURNS event_trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//    SET search_path TO 'pg_catalog'
//   AS $function$
//   DECLARE
//     cmd record;
//   BEGIN
//     FOR cmd IN
//       SELECT *
//       FROM pg_event_trigger_ddl_commands()
//       WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
//         AND object_type IN ('table','partitioned table')
//     LOOP
//        IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
//         BEGIN
//           EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
//           RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
//         EXCEPTION
//           WHEN OTHERS THEN
//             RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
//         END;
//        ELSE
//           RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
//        END IF;
//     END LOOP;
//   END;
//   $function$
//   
// FUNCTION sync_pontos_diarios()
//   CREATE OR REPLACE FUNCTION public.sync_pontos_diarios()
//    RETURNS trigger
//    LANGUAGE plpgsql
//    SECURITY DEFINER
//   AS $function$
//   BEGIN
//     INSERT INTO public.pontos_diarios (funcionario_id, data, entrada, saida_almoco, retorno_almoco, saida)
//     VALUES (
//       NEW.funcionario_id,
//       NEW.data,
//       CASE WHEN NEW.tipo_ponto IN ('Entrada', 'entrada') THEN NEW.horario ELSE NULL END,
//       CASE WHEN NEW.tipo_ponto IN ('Saída Almoço', 'Saida Almoço', 'saida_almoco') THEN NEW.horario ELSE NULL END,
//       CASE WHEN NEW.tipo_ponto IN ('Retorno Almoço', 'retorno_almoco') THEN NEW.horario ELSE NULL END,
//       CASE WHEN NEW.tipo_ponto IN ('Saída', 'Saida', 'saida') THEN NEW.horario ELSE NULL END
//     )
//     ON CONFLICT (funcionario_id, data) DO UPDATE SET
//       entrada = COALESCE(EXCLUDED.entrada, public.pontos_diarios.entrada),
//       saida_almoco = COALESCE(EXCLUDED.saida_almoco, public.pontos_diarios.saida_almoco),
//       retorno_almoco = COALESCE(EXCLUDED.retorno_almoco, public.pontos_diarios.retorno_almoco),
//       saida = COALESCE(EXCLUDED.saida, public.pontos_diarios.saida),
//       updated_at = NOW();
//     RETURN NEW;
//   END;
//   $function$
//   

// --- TRIGGERS ---
// Table: pontos
//   trigger_sync_pontos_diarios: CREATE TRIGGER trigger_sync_pontos_diarios AFTER INSERT OR UPDATE ON public.pontos FOR EACH ROW EXECUTE FUNCTION sync_pontos_diarios()

// --- INDEXES ---
// Table: funcionarios
//   CREATE UNIQUE INDEX funcionarios_cpf_key ON public.funcionarios USING btree (cpf)
//   CREATE UNIQUE INDEX funcionarios_email_key ON public.funcionarios USING btree (email)
// Table: pontos
//   CREATE UNIQUE INDEX pontos_nsr_key ON public.pontos USING btree (nsr)
// Table: pontos_diarios
//   CREATE UNIQUE INDEX pontos_diarios_funcionario_id_data_key ON public.pontos_diarios USING btree (funcionario_id, data)
// Table: punch_adjustments
//   CREATE UNIQUE INDEX punch_adjustments_nsr_key ON public.punch_adjustments USING btree (nsr)

