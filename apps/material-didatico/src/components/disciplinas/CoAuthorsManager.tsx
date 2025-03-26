import { useState, useEffect } from 'react'
import { UserPlus, Users, UserMinus, Shield, Edit, Eye, Download, Share } from 'lucide-react'
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, Input, Select, SelectItem, Avatar, AvatarFallback, AvatarImage, Badge, Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@edunexia/ui-components'
import { permissionsService } from '@/services/permissions'
import { UserPermission, UserRole } from '@/types/editor'
import { useToast } from '@/hooks/use-toast'

interface CoAuthorsManagerProps {
  contentId: string
  disciplineId: string
  isOwner: boolean
  userId: string
}

type UserWithPermission = UserPermission & {
  name: string
  email?: string
  avatarUrl?: string
}

/**
 * Componente para gerenciar coautores e suas permissões
 */
export function CoAuthorsManager({ contentId, disciplineId, isOwner, userId }: CoAuthorsManagerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [coAuthors, setCoAuthors] = useState<UserWithPermission[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<UserRole>('viewer')
  const [isAddingUser, setIsAddingUser] = useState(false)
  const { toast } = useToast()

  // Carrega coautores ao abrir o diálogo
  useEffect(() => {
    if (isOpen) {
      loadCoAuthors()
    }
  }, [isOpen, contentId])

  // Busca coautores da API
  const loadCoAuthors = async () => {
    try {
      setIsLoading(true)
      const authors = await permissionsService.getContentCoAuthors(contentId)
      
      // Formata para o componente
      const formattedAuthors = authors.map(author => ({
        ...author,
        name: author.name || 'Usuário',
        email: author.email || '',
        avatarUrl: '', // Em uma implementação real, buscaríamos o avatar
      }))
      
      setCoAuthors(formattedAuthors)
    } catch (error) {
      console.error('Erro ao carregar coautores:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os coautores.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Adiciona um novo coautor
  const handleAddCoAuthor = async () => {
    try {
      setIsAddingUser(true)
      
      // Validações básicas
      if (!newUserEmail || !newUserEmail.includes('@')) {
        toast({
          title: 'E-mail inválido',
          description: 'Por favor, insira um e-mail válido.',
          variant: 'destructive'
        })
        return
      }
      
      // Em uma implementação real, buscaríamos o usuário pelo e-mail primeiro
      // Simulando para o exemplo
      const simulatedUser = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: newUserEmail.split('@')[0],
        email: newUserEmail
      }
      
      // Adiciona o coautor
      const success = await permissionsService.addCoAuthor(
        contentId,
        simulatedUser.id,
        newUserRole
      )
      
      if (success) {
        toast({
          title: 'Coautor adicionado',
          description: `${simulatedUser.name} foi adicionado como ${translateRole(newUserRole)}.`
        })
        
        // Reseta campos e recarrega lista
        setNewUserEmail('')
        setNewUserRole('viewer')
        await loadCoAuthors()
      } else {
        throw new Error('Não foi possível adicionar o coautor')
      }
    } catch (error) {
      console.error('Erro ao adicionar coautor:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível adicionar o coautor.',
        variant: 'destructive'
      })
    } finally {
      setIsAddingUser(false)
    }
  }

  // Remove um coautor
  const handleRemoveCoAuthor = async (authorId: string, authorName: string) => {
    try {
      setIsLoading(true)
      
      const success = await permissionsService.removeCoAuthor(contentId, authorId)
      
      if (success) {
        toast({
          title: 'Coautor removido',
          description: `${authorName} foi removido da disciplina.`
        })
        
        // Atualiza a lista local
        setCoAuthors(prev => prev.filter(author => author.userId !== authorId))
      } else {
        throw new Error('Não foi possível remover o coautor')
      }
    } catch (error) {
      console.error('Erro ao remover coautor:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível remover o coautor.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Atualiza a permissão de um coautor
  const handleUpdatePermission = async (authorId: string, permission: keyof Omit<UserPermission, 'userId' | 'role'>, value: boolean) => {
    try {
      setIsLoading(true)
      
      const updateData: Partial<UserPermission> = {
        [permission]: value
      }
      
      const success = await permissionsService.updateCoAuthorPermissions(
        contentId,
        authorId,
        updateData
      )
      
      if (success) {
        // Atualiza a lista local
        setCoAuthors(prev => prev.map(author => 
          author.userId === authorId 
            ? { ...author, [permission]: value } 
            : author
        ))
        
        toast({
          title: 'Permissões atualizadas',
          description: 'As permissões foram atualizadas com sucesso.'
        })
      } else {
        throw new Error('Não foi possível atualizar as permissões')
      }
    } catch (error) {
      console.error('Erro ao atualizar permissões:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Atualiza o papel de um coautor
  const handleUpdateRole = async (authorId: string, role: UserRole) => {
    try {
      setIsLoading(true)
      
      const updateData: Partial<UserPermission> = {
        role
      }
      
      const success = await permissionsService.updateCoAuthorPermissions(
        contentId,
        authorId,
        updateData
      )
      
      if (success) {
        // Atualiza a lista local
        setCoAuthors(prev => prev.map(author => 
          author.userId === authorId 
            ? { ...author, role } 
            : author
        ))
        
        toast({
          title: 'Papel atualizado',
          description: `O papel foi atualizado para ${translateRole(role)}.`
        })
      } else {
        throw new Error('Não foi possível atualizar o papel')
      }
    } catch (error) {
      console.error('Erro ao atualizar papel:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o papel.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Traduz o papel para português
  const translateRole = (role: UserRole): string => {
    switch (role) {
      case 'owner':
        return 'Proprietário'
      case 'editor':
        return 'Editor'
      case 'reviewer':
        return 'Revisor'
      case 'viewer':
        return 'Visualizador'
      default:
        return role
    }
  }

  // Obtém a cor do badge com base no papel
  const getRoleBadgeColor = (role: UserRole): string => {
    switch (role) {
      case 'owner':
        return 'bg-blue-500'
      case 'editor':
        return 'bg-green-500'
      case 'reviewer':
        return 'bg-yellow-500'
      case 'viewer':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
        disabled={!isOwner && !permissionsService.checkPermission(contentId, userId, 'share')}
      >
        <Users className="h-4 w-4" />
        <span>Coautores</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gerenciar Coautores
            </DialogTitle>
          </DialogHeader>
          
          {isOwner && (
            <div className="flex items-end gap-2 mb-6">
              <div className="flex-1 space-y-1">
                <label className="text-sm font-medium">E-mail do usuário</label>
                <Input 
                  placeholder="email@exemplo.com" 
                  value={newUserEmail} 
                  onChange={(e) => setNewUserEmail(e.target.value)}
                />
              </div>
              <div className="w-40 space-y-1">
                <label className="text-sm font-medium">Papel</label>
                <Select 
                  value={newUserRole} 
                  onValueChange={(value) => setNewUserRole(value as UserRole)}
                >
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="reviewer">Revisor</SelectItem>
                  <SelectItem value="viewer">Visualizador</SelectItem>
                </Select>
              </div>
              <Button
                variant="default"
                className="flex items-center gap-2"
                disabled={isAddingUser || !newUserEmail}
                onClick={handleAddCoAuthor}
              >
                <UserPlus className="h-4 w-4" />
                <span>Adicionar</span>
              </Button>
            </div>
          )}
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Papel</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coAuthors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                      {isLoading ? 'Carregando coautores...' : 'Nenhum coautor adicionado'}
                    </TableCell>
                  </TableRow>
                ) : (
                  coAuthors.map((author) => (
                    <TableRow key={author.userId}>
                      <TableCell className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={author.avatarUrl} />
                          <AvatarFallback>{author.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{author.name}</div>
                          <div className="text-sm text-gray-500">{author.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isOwner ? (
                          <Select 
                            value={author.role} 
                            onValueChange={(value) => handleUpdateRole(author.userId, value as UserRole)}
                            disabled={isLoading}
                          >
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="reviewer">Revisor</SelectItem>
                            <SelectItem value="viewer">Visualizador</SelectItem>
                          </Select>
                        ) : (
                          <Badge className={getRoleBadgeColor(author.role)}>
                            {translateRole(author.role)}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          <Badge 
                            variant={author.canEdit ? 'default' : 'outline'}
                            className="flex items-center gap-1"
                            onClick={() => isOwner && handleUpdatePermission(author.userId, 'canEdit', !author.canEdit)}
                          >
                            <Edit className="h-3 w-3" />
                            Editar
                          </Badge>
                          <Badge 
                            variant={author.canExport ? 'default' : 'outline'}
                            className="flex items-center gap-1"
                            onClick={() => isOwner && handleUpdatePermission(author.userId, 'canExport', !author.canExport)}
                          >
                            <Download className="h-3 w-3" />
                            Exportar
                          </Badge>
                          <Badge 
                            variant={author.canShare ? 'default' : 'outline'}
                            className="flex items-center gap-1"
                            onClick={() => isOwner && handleUpdatePermission(author.userId, 'canShare', !author.canShare)}
                          >
                            <Share className="h-3 w-3" />
                            Compartilhar
                          </Badge>
                          <Badge 
                            variant={author.canDelete ? 'default' : 'outline'}
                            className="flex items-center gap-1"
                            onClick={() => isOwner && handleUpdatePermission(author.userId, 'canDelete', !author.canDelete)}
                          >
                            <Shield className="h-3 w-3" />
                            Deletar
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isOwner && (
                          <Button 
                            variant="destructive" 
                            size="sm"
                            className="flex items-center gap-1"
                            onClick={() => handleRemoveCoAuthor(author.userId, author.name)}
                            disabled={isLoading}
                          >
                            <UserMinus className="h-3 w-3" />
                            <span>Remover</span>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 