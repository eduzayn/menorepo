import { createClient } from '@supabase/supabase-js'
import { Content } from '@/types/editor'

interface VersionHistoryItem {
  id: string
  contentId: string
  version: string
  createdAt: Date
  author: string
  authorId: string
  changeDescription?: string
  snapshotData: string // JSON string com o conteúdo completo
}

class VersionService {
  private static instance: VersionService
  private supabase: any

  private constructor() {
    // Inicializa o cliente Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  public static getInstance(): VersionService {
    if (!VersionService.instance) {
      VersionService.instance = new VersionService()
    }
    return VersionService.instance
  }

  /**
   * Cria uma nova versão de um conteúdo
   * @param content Conteúdo a ser versionado
   * @param userId ID do usuário que criou a versão
   * @param description Descrição da mudança
   * @returns Sucesso da operação
   */
  public async createVersion(
    content: Content,
    userId: string,
    description?: string
  ): Promise<boolean> {
    try {
      // Gera uma nova versão (formato: 1.0.0, 1.0.1, etc.)
      const newVersion = await this.generateNewVersionNumber(content.id)
      
      // Prepara o item de histórico
      const historyItem: Omit<VersionHistoryItem, 'id'> = {
        contentId: content.id,
        version: newVersion,
        createdAt: new Date(),
        author: content.version.author,
        authorId: userId,
        changeDescription: description,
        snapshotData: JSON.stringify(content)
      }
      
      // Salva o histórico no Supabase
      const { error: historyError } = await this.supabase
        .from('content_version_history')
        .insert(historyItem)
      
      if (historyError) {
        console.error('Erro ao criar histórico de versão:', historyError)
        return false
      }
      
      // Atualiza a versão atual do conteúdo
      const { error: contentError } = await this.supabase
        .from('contents')
        .update({
          current_version: newVersion,
          updated_at: new Date().toISOString(),
          last_updated_by: userId
        })
        .eq('id', content.id)
      
      if (contentError) {
        console.error('Erro ao atualizar versão do conteúdo:', contentError)
        return false
      }
      
      return true
    } catch (error) {
      console.error('Erro ao criar versão:', error)
      return false
    }
  }

  /**
   * Obtém o histórico de versões de um conteúdo
   * @param contentId ID do conteúdo
   * @returns Lista de itens do histórico de versões
   */
  public async getVersionHistory(contentId: string): Promise<VersionHistoryItem[]> {
    try {
      const { data, error } = await this.supabase
        .from('content_version_history')
        .select(`
          id,
          content_id,
          version,
          created_at,
          author,
          author_id,
          change_description,
          snapshot_data
        `)
        .eq('content_id', contentId)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Erro ao buscar histórico de versões:', error)
        return []
      }
      
      // Converte o formato do banco para o formato da aplicação
      return data.map((item: any) => ({
        id: item.id,
        contentId: item.content_id,
        version: item.version,
        createdAt: new Date(item.created_at),
        author: item.author,
        authorId: item.author_id,
        changeDescription: item.change_description,
        snapshotData: item.snapshot_data
      }))
    } catch (error) {
      console.error('Erro ao buscar histórico de versões:', error)
      return []
    }
  }

  /**
   * Restaura uma versão anterior de um conteúdo
   * @param contentId ID do conteúdo
   * @param versionId ID da versão a ser restaurada
   * @param userId ID do usuário que está restaurando
   * @returns Sucesso da operação
   */
  public async restoreVersion(
    contentId: string,
    versionId: string,
    userId: string
  ): Promise<boolean> {
    try {
      // Busca o snapshot da versão a ser restaurada
      const { data, error } = await this.supabase
        .from('content_version_history')
        .select('snapshot_data, version')
        .eq('id', versionId)
        .eq('content_id', contentId)
        .single()
      
      if (error || !data) {
        console.error('Erro ao buscar versão para restaurar:', error)
        return false
      }
      
      // Converte o snapshot para objeto
      const snapshotContent = JSON.parse(data.snapshot_data) as Content
      
      // Atualiza a versão atual no banco
      const { error: updateError } = await this.supabase
        .from('contents')
        .update({
          content_data: snapshotContent,
          current_version: data.version,
          updated_at: new Date().toISOString(),
          last_updated_by: userId,
          is_restored_version: true
        })
        .eq('id', contentId)
      
      if (updateError) {
        console.error('Erro ao restaurar versão:', updateError)
        return false
      }
      
      // Cria um registro de restauração no histórico
      await this.createVersion(
        snapshotContent,
        userId,
        `Versão restaurada para ${data.version}`
      )
      
      return true
    } catch (error) {
      console.error('Erro ao restaurar versão:', error)
      return false
    }
  }

  /**
   * Compara duas versões do conteúdo
   * @param contentId ID do conteúdo
   * @param versionIdA ID da primeira versão
   * @param versionIdB ID da segunda versão
   * @returns Diferenças entre as versões
   */
  public async compareVersions(
    contentId: string,
    versionIdA: string,
    versionIdB: string
  ): Promise<any> {
    try {
      // Busca os snapshots das duas versões
      const { data, error } = await this.supabase
        .from('content_version_history')
        .select('id, version, snapshot_data')
        .eq('content_id', contentId)
        .in('id', [versionIdA, versionIdB])
      
      if (error || !data || data.length !== 2) {
        console.error('Erro ao buscar versões para comparar:', error)
        return null
      }
      
      // Converte os snapshots para objetos
      const versionA = data.find(v => v.id === versionIdA)
      const versionB = data.find(v => v.id === versionIdB)
      
      if (!versionA || !versionB) {
        console.error('Versões não encontradas')
        return null
      }
      
      const contentA = JSON.parse(versionA.snapshot_data) as Content
      const contentB = JSON.parse(versionB.snapshot_data) as Content
      
      // Implementação simplificada de comparação
      // Em uma implementação real, seria usado um algoritmo mais sofisticado
      return {
        versionA: versionA.version,
        versionB: versionB.version,
        changes: {
          blocks: {
            added: contentB.blocks.filter(b => !contentA.blocks.find(a => a.id === b.id)).length,
            removed: contentA.blocks.filter(a => !contentB.blocks.find(b => b.id === a.id)).length,
            modified: contentB.blocks.filter(b => {
              const blockA = contentA.blocks.find(a => a.id === b.id)
              return blockA && JSON.stringify(blockA) !== JSON.stringify(b)
            }).length
          },
          metadata: JSON.stringify(contentA.metadata) !== JSON.stringify(contentB.metadata)
        }
      }
    } catch (error) {
      console.error('Erro ao comparar versões:', error)
      return null
    }
  }

  /**
   * Gera um novo número de versão para um conteúdo
   * @param contentId ID do conteúdo
   * @returns Novo número de versão
   */
  private async generateNewVersionNumber(contentId: string): Promise<string> {
    try {
      // Busca a versão atual do conteúdo
      const { data, error } = await this.supabase
        .from('contents')
        .select('current_version')
        .eq('id', contentId)
        .single()
      
      if (error || !data) {
        // Se não encontrou, começa na versão 1.0.0
        return '1.0.0'
      }
      
      // Incrementa a versão (apenas o último número)
      const currentVersion = data.current_version || '1.0.0'
      const versionParts = currentVersion.split('.')
      const lastPart = parseInt(versionParts[2] || '0', 10) + 1
      return `${versionParts[0]}.${versionParts[1]}.${lastPart}`
    } catch (error) {
      console.error('Erro ao gerar número de versão:', error)
      return '1.0.0' // Fallback para versão inicial
    }
  }
}

export const versionService = VersionService.getInstance() 