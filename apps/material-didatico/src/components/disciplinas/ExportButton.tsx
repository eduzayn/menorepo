import { useState } from 'react'
import { FileDown, Download, FileText, FileX } from 'lucide-react'
import { 
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  RadioGroup,
  RadioGroupItem,
  Label,
  Checkbox,
  Spinner
} from '@edunexia/ui-components'
import { exportService } from '@/services/export'
import { permissionsService } from '@/services/permissions'
import { ExportFormat, ExportOptions } from '@/types/editor'
import { useToast } from '@/hooks/use-toast'

interface ExportButtonProps {
  disciplineId: string
  contentId: string
  disciplineName: string
  userId: string
}

/**
 * Botão de exportação para disciplinas
 * Permite exportar o conteúdo em diferentes formatos
 */
export function ExportButton({ disciplineId, contentId, disciplineName, userId }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [format, setFormat] = useState<ExportFormat>('pdf')
  const [includeInteractive, setIncludeInteractive] = useState(true)
  const [targetAudience, setTargetAudience] = useState<ExportOptions['targetAudience']>('students')
  const { toast } = useToast()

  // Verifica permissão de exportação
  const handleExport = async () => {
    try {
      setIsLoading(true)
      
      // Verifica permissão
      const hasPermission = await permissionsService.checkPermission(
        contentId,
        userId,
        'export'
      )
      
      if (!hasPermission) {
        toast({
          title: 'Sem permissão',
          description: 'Você não tem permissão para exportar este conteúdo.',
          variant: 'destructive'
        })
        setIsLoading(false)
        setIsOpen(false)
        return
      }
      
      // Busca conteúdo da API (em uma implementação real)
      // Aqui estamos simulando o conteúdo
      const response = await fetch(`/api/content/${contentId}`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar conteúdo')
      }
      
      const content = await response.json()
      
      // Configura opções de exportação
      const options: ExportOptions = {
        format,
        includeInteractive,
        targetAudience,
      }
      
      // Exporta conteúdo
      const result = await exportService.exportContent(content, options)
      
      // Trata o resultado da exportação
      if (typeof result === 'string') {
        // É uma URL, redireciona para download
        window.open(result, '_blank')
      } else {
        // É um blob, cria um link de download
        const url = URL.createObjectURL(result)
        const a = document.createElement('a')
        a.href = url
        a.download = `${disciplineName.replace(/\s+/g, '-').toLowerCase()}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }
      
      // Feedback para o usuário
      toast({
        title: 'Exportação concluída',
        description: `Conteúdo exportado com sucesso no formato ${format.toUpperCase()}`,
      })
    } catch (error) {
      console.error('Erro ao exportar:', error)
      toast({
        title: 'Erro na exportação',
        description: 'Ocorreu um erro ao exportar o conteúdo.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <FileDown className="h-4 w-4" />
          <span>Exportar</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Exportar conteúdo</h4>
            <p className="text-sm text-muted-foreground">
              Escolha o formato e as opções para exportar esta disciplina.
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="format">Formato</Label>
            <RadioGroup 
              id="format" 
              value={format} 
              onValueChange={(value) => setFormat(value as ExportFormat)}
              className="grid grid-cols-3 gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> PDF
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="html" id="html" />
                <Label htmlFor="html" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> HTML
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scorm" id="scorm" />
                <Label htmlFor="scorm" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" /> SCORM
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Opções</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="interactive" 
                checked={includeInteractive} 
                onCheckedChange={(checked) => setIncludeInteractive(!!checked)} 
              />
              <Label htmlFor="interactive">Incluir conteúdo interativo</Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="target">Público-alvo</Label>
            <RadioGroup 
              id="target" 
              value={targetAudience} 
              onValueChange={(value) => setTargetAudience(value as ExportOptions['targetAudience'])}
              className="space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="students" id="students" />
                <Label htmlFor="students">Alunos</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="teachers" id="teachers" />
                <Label htmlFor="teachers">Professores</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="both" id="both" />
                <Label htmlFor="both">Ambos</Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button 
            onClick={handleExport} 
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                <span>Exportando...</span>
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                <span>Exportar como {format.toUpperCase()}</span>
              </>
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 