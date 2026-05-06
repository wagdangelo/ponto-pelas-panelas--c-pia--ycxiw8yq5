export const maskCPF = (v: string) => {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

export const maskPhone = (v: string) => {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
    .slice(0, 15)
}

export const maskCEP = (v: string) => {
  return v
    .replace(/\D/g, '')
    .replace(/(\d{5})(\d{1,3})$/, '$1-$2')
    .slice(0, 9)
}
