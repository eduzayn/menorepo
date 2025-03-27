import { useState, useEffect, createContext, useContext } from 'react'

// Definindo o tipo do usuário
export type UserRole = 'admin' | 'secretaria' | 'financeiro' | 'aluno' | 'professor' | 'documentacao'

export interface User {
  id: string
  name: string
  email: string
  roles: UserRole[]
}

// Criando o contexto de autenticação
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

// Contexto padrão
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  logout: async () => {}
})

// Provider que será usado no app
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar se há um usuário na sessão ao carregar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simulando uma verificação de autenticação
        // Em produção, isso verificaria um token JWT ou uma sessão
        const storedUser = localStorage.getItem('edunexia_user')
        
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Função de login
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      
      // Simulação de login
      // Em produção, isso faria uma chamada à API de autenticação
      if (email && password) {
        // Usuário admin simulado para desenvolvimento
        const mockUser: User = {
          id: '1',
          name: 'Administrador',
          email: email,
          roles: ['admin', 'secretaria', 'financeiro']
        }
        
        setUser(mockUser)
        localStorage.setItem('edunexia_user', JSON.stringify(mockUser))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Função de logout
  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      
      // Limpar dados do usuário
      setUser(null)
      localStorage.removeItem('edunexia_user')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext) 