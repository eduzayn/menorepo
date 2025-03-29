import { useState, useEffect } from 'react'

interface User {
  name?: string
  email?: string
  avatar?: string
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Simulação de carregamento do usuário
    // Em um ambiente real, isso seria uma chamada à API ou ao serviço de autenticação
    const fetchUser = async () => {
      try {
        // Simulando um atraso de carregamento
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Simulando um usuário autenticado
        const userData = {
          name: 'Usuário Teste',
          email: 'usuario@edunexia.com',
          avatar: '/images/avatar.png'
        }
        
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [])

  const logout = () => {
    // Simulação de logout
    // Em um ambiente real, isso faria logout da API ou serviço de autenticação
    setUser(null)
    setIsAuthenticated(false)
    // Redirecionamento para a página de login seria feito aqui
    window.location.href = '/login'
  }

  const hasPermission = (role: string) => {
    // Simulação de verificação de permissão
    // Em um ambiente real, isso verificaria as permissões do usuário
    return true
  }

  return {
    user,
    isLoading,
    isAuthenticated,
    logout,
    hasPermission
  }
} 