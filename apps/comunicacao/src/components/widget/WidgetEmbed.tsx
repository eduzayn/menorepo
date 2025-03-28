import React, { useState, useEffect } from 'react';
import { CopyIcon, CheckIcon } from 'lucide-react';

interface WidgetEmbedProps {
  config: {
    title?: string;
    subtitle?: string;
    primaryColor?: string;
    logoUrl?: string;
    position?: 'bottom-right' | 'bottom-left';
    greeting?: string;
    departamentoId?: string;
  };
  baseUrl: string;
}

const WidgetEmbed: React.FC<WidgetEmbedProps> = ({ 
  config, 
  baseUrl = 'https://comunicacao.edunexia.com.br' 
}) => {
  const [copied, setCopied] = useState(false);
  
  // Gera o script para inclusão do widget
  const generateEmbedScript = () => {
    const configString = JSON.stringify(config);
    
    return `
<!-- Início do Widget de Chat Edunéxia -->
<script>
  (function() {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = '${baseUrl}/widget.js';
    script.onload = function() {
      window.EdunexiaChatWidget.init(${configString});
    };
    var entry = document.getElementsByTagName('script')[0];
    entry.parentNode.insertBefore(script, entry);
  })();
</script>
<!-- Fim do Widget de Chat Edunéxia -->
`.trim();
  };

  // Copiar código para a área de transferência
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateEmbedScript()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Código para incorporação</h3>
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-1 text-sm bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded-md transition"
        >
          {copied ? (
            <>
              <CheckIcon className="h-4 w-4" />
              <span>Copiado!</span>
            </>
          ) : (
            <>
              <CopyIcon className="h-4 w-4" />
              <span>Copiar código</span>
            </>
          )}
        </button>
      </div>
      
      <div className="relative">
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm font-mono whitespace-pre-wrap">
          {generateEmbedScript()}
        </pre>
      </div>
      
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">Instruções:</p>
        <ol className="list-decimal pl-4 space-y-1">
          <li>Copie o código acima.</li>
          <li>Cole-o antes do fechamento da tag <code>&lt;/body&gt;</code> do seu site.</li>
          <li>O widget será carregado automaticamente quando os visitantes acessarem seu site.</li>
        </ol>
      </div>
    </div>
  );
};

export default WidgetEmbed; 