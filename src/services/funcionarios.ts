import { supabase } from '@/lib/supabase/client'

export const getFuncionarios = async () => {
  const { data, error } = await supabase.from('funcionarios').select('*').order('nome')

  if (error) throw error
  return data
}

export const manageFuncionario = async (action: 'create' | 'update' | 'delete', payload: any) => {
  const { data, error } = await supabase.functions.invoke('manageUsers', {
    body: { action, payload },
  })

  if (error) throw error
  if (data?.status === 'error') throw new Error(data.message)

  return data?.data
}
