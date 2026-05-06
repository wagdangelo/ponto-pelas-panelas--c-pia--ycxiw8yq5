import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'jsr:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, x-supabase-client-platform, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Missing Authorization header')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } },
    )

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()
    if (authError || !user) throw new Error('Unauthorized')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: profile } = await supabaseAdmin
      .from('funcionarios')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!['Admin', 'Adm', 'Gerente', 'RH'].includes(profile?.role || '')) {
      throw new Error(
        'Acesso negado: Apenas administradores, gerentes ou RH podem gerenciar funcionários.',
      )
    }

    const { action, payload } = await req.json()
    let result

    switch (action) {
      case 'create': {
        const {
          nome,
          email,
          password,
          role,
          cpf,
          telefone,
          data_nascimento,
          cargo,
          turno,
          data_admissao,
          salario_base,
          cep,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          tipo_contrato,
          status,
          horarios,
          documentos,
        } = payload

        const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password: password || 'Password123!',
          email_confirm: true,
          user_metadata: { name: nome },
        })
        if (createError) throw createError

        const { data: profileData, error: profileError } = await supabaseAdmin
          .from('funcionarios')
          .upsert(
            {
              id: authData.user.id,
              email,
              nome,
              role: role || 'Colaborador',
              cpf,
              telefone,
              data_nascimento,
              cargo,
              turno,
              data_admissao,
              salario_base,
              cep,
              rua,
              numero,
              complemento,
              bairro,
              cidade,
              tipo_contrato,
              status: status || 'Ativo',
              horarios,
              documentos,
            },
            { onConflict: 'id' },
          )
          .select()
          .single()

        if (profileError) throw profileError
        result = profileData
        break
      }
      case 'read': {
        const { id } = payload || {}
        if (id) {
          const { data, error } = await supabaseAdmin
            .from('funcionarios')
            .select('*')
            .eq('id', id)
            .single()
          if (error) throw error
          result = data
        } else {
          const { data, error } = await supabaseAdmin
            .from('funcionarios')
            .select('*')
            .order('nome', { ascending: true })
          if (error) throw error
          result = data
        }
        break
      }
      case 'update': {
        const {
          id,
          nome,
          email,
          password,
          role,
          cpf,
          telefone,
          data_nascimento,
          cargo,
          turno,
          data_admissao,
          salario_base,
          cep,
          rua,
          numero,
          complemento,
          bairro,
          cidade,
          tipo_contrato,
          status,
          horarios,
          documentos,
        } = payload

        const authUpdates: any = {}
        if (email) authUpdates.email = email
        if (password) authUpdates.password = password
        if (nome) authUpdates.user_metadata = { name: nome }

        if (Object.keys(authUpdates).length > 0) {
          const { error: updateAuthError } = await supabaseAdmin.auth.admin.updateUserById(
            id,
            authUpdates,
          )
          if (updateAuthError) {
            console.warn(`Aviso: Falha ao atualizar auth.users - ${updateAuthError.message}`)
          }
        }

        const updateDataFunc: any = {}
        if (nome !== undefined) updateDataFunc.nome = nome
        if (email !== undefined) updateDataFunc.email = email
        if (role !== undefined) updateDataFunc.role = role
        if (cpf !== undefined) updateDataFunc.cpf = cpf
        if (telefone !== undefined) updateDataFunc.telefone = telefone
        if (data_nascimento !== undefined) updateDataFunc.data_nascimento = data_nascimento
        if (cargo !== undefined) updateDataFunc.cargo = cargo
        if (turno !== undefined) updateDataFunc.turno = turno
        if (data_admissao !== undefined) updateDataFunc.data_admissao = data_admissao
        if (salario_base !== undefined) updateDataFunc.salario_base = salario_base
        if (cep !== undefined) updateDataFunc.cep = cep
        if (rua !== undefined) updateDataFunc.rua = rua
        if (numero !== undefined) updateDataFunc.numero = numero
        if (complemento !== undefined) updateDataFunc.complemento = complemento
        if (bairro !== undefined) updateDataFunc.bairro = bairro
        if (cidade !== undefined) updateDataFunc.cidade = cidade
        if (tipo_contrato !== undefined) updateDataFunc.tipo_contrato = tipo_contrato
        if (status !== undefined) updateDataFunc.status = status
        if (horarios !== undefined) updateDataFunc.horarios = horarios
        if (documentos !== undefined) updateDataFunc.documentos = documentos

        const { data, error } = await supabaseAdmin
          .from('funcionarios')
          .update(updateDataFunc)
          .eq('id', id)
          .select()
          .single()

        if (error) throw error
        result = data
        break
      }
      case 'delete': {
        const { id } = payload

        const { error } = await supabaseAdmin.auth.admin.deleteUser(id)
        if (error) {
          console.warn('Failed to delete user from auth, attempting direct deletion')
        }

        const { error: dbError } = await supabaseAdmin.from('funcionarios').delete().eq('id', id)
        if (dbError) throw dbError
        result = { deletedId: id }
        break
      }
      default:
        throw new Error('Ação inválida.')
    }

    return new Response(
      JSON.stringify({
        status: 'success',
        message: 'Operação realizada com sucesso.',
        data: result,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error: any) {
    return new Response(JSON.stringify({ status: 'error', message: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
