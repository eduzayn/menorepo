import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import { 
  Download, 
  FileDigit, 
  FileText, 
  FilePdf,
  Loader2 
} from 'lucide-react';
import { exportToSCORM, exportToPDF } from '@/services/export';
import { Content } from '@/types/editor';

interface ExportButtonProps {
  content: Content;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
}

export function ExportButton({ 
  content,
  variant = 'default',
  size = 'default',
  disabled = false
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportFormat, setExportFormat] = useState<'scorm' | 'pdf'>('scorm');
  
  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let exportUrl: string;
      let formatName: string;
      
      if (exportFormat === 'scorm') {
        exportUrl = await exportToSCORM(content);
        formatName = 'SCORM';
      } else {
        exportUrl = await exportToPDF(content);
        formatName = 'PDF';
      }
      
      // Criar um link para download e simular clique
      const downloadLink = document.createElement('a');
      downloadLink.href = exportUrl;
      downloadLink.download = `${content.metadata.title.replace(/\s+/g, '_')}_${exportFormat}`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: 'Exportação concluída',
        description: `O conteúdo foi exportado com sucesso no formato ${formatName}.`
      });
    } catch (error) {
      console.error(`Erro ao exportar para ${exportFormat.toUpperCase()}:`, error);
      
      toast({
        title: 'Erro na exportação',
        description: `Não foi possível exportar o conteúdo para ${exportFormat.toUpperCase()}.`,
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant={variant} 
          size={size}
          disabled={disabled || isExporting}
          className="flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Formato de Exportação</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuRadioGroup 
          value={exportFormat} 
          onValueChange={(value) => setExportFormat(value as 'scorm' | 'pdf')}
        >
          <DropdownMenuRadioItem value="scorm" className="flex items-center gap-2 cursor-pointer">
            <FileDigit className="h-4 w-4 text-blue-500" />
            <div className="flex flex-col">
              <span>SCORM 1.2</span>
              <span className="text-xs text-muted-foreground">
                Compatível com LMS
              </span>
            </div>
          </DropdownMenuRadioItem>
          
          <DropdownMenuRadioItem value="pdf" className="flex items-center gap-2 cursor-pointer">
            <FilePdf className="h-4 w-4 text-red-500" />
            <div className="flex flex-col">
              <span>PDF</span>
              <span className="text-xs text-muted-foreground">
                Documento portátil
              </span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem
          className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Exportar como {exportFormat.toUpperCase()}
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 