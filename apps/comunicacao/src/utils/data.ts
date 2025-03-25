export function formatarData(data: string): string {
  const agora = new Date()
  const dataMsg = new Date(data)
  const diff = agora.getTime() - dataMsg.getTime()
  const umDia = 24 * 60 * 60 * 1000
  const umaHora = 60 * 60 * 1000
  const umMinuto = 60 * 1000

  if (diff < umMinuto) {
    return 'Agora'
  } else if (diff < umaHora) {
    const minutos = Math.floor(diff / umMinuto)
    return `${minutos}m`
  } else if (diff < umDia) {
    const horas = Math.floor(diff / umaHora)
    return `${horas}h`
  } else if (diff < 7 * umDia) {
    const dias = Math.floor(diff / umDia)
    return `${dias}d`
  } else {
    return dataMsg.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    })
  }
} 