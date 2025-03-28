import { Content, ExportFormat, ExportOptions } from '@/types/editor'
import { jsPDF } from 'jspdf'

class ExportService {
  private static instance: ExportService

  private constructor() {}

  public static getInstance(): ExportService {
    if (!ExportService.instance) {
      ExportService.instance = new ExportService()
    }
    return ExportService.instance
  }

  /**
   * Exporta o conteúdo no formato especificado
   * @param content Conteúdo a ser exportado
   * @param options Opções de exportação
   * @returns Promise com o URL ou blob do arquivo exportado
   */
  public async exportContent(content: Content, options: ExportOptions): Promise<string | Blob> {
    switch (options.format) {
      case 'pdf':
        return this.exportToPDF(content, options)
      case 'html':
        return this.exportToHTML(content, options)
      case 'scorm':
        return this.exportToSCORM(content, options)
      default:
        throw new Error(`Formato de exportação ${options.format} não suportado`)
    }
  }

  /**
   * Exporta o conteúdo para PDF
   * @param content Conteúdo a ser exportado
   * @param options Opções de exportação
   * @returns Promise com o blob do PDF
   */
  private async exportToPDF(content: Content, options: ExportOptions): Promise<Blob> {
    try {
      const doc = new jsPDF()
      
      // Adiciona título e metadados
      doc.setFontSize(22)
      doc.text(content.metadata.title, 20, 20)
      
      doc.setFontSize(12)
      if (content.metadata.description) {
        doc.text(content.metadata.description, 20, 30)
      }
      
      doc.setFontSize(10)
      doc.text(`Versão: ${content.version.number}`, 20, 40)
      doc.text(`Última atualização: ${content.version.updatedAt.toLocaleDateString()}`, 20, 45)
      doc.text(`Autor: ${content.version.author}`, 20, 50)
      
      // Adiciona conteúdo dos blocos
      let yPosition = 60
      
      content.blocks.forEach(block => {
        switch(block.type) {
          case 'text':
            doc.setFontSize(14)
            if (block.title) {
              doc.text(block.title, 20, yPosition)
              yPosition += 10
            }
            
            doc.setFontSize(12)
            // Quebra o texto em linhas para caber na página
            const splitText = doc.splitTextToSize(block.content, 170)
            doc.text(splitText, 20, yPosition)
            yPosition += splitText.length * 7 + 10
            break
            
          case 'quiz':
          case 'activity':
            if (block.title) {
              doc.setFontSize(14)
              doc.text(block.title, 20, yPosition)
              yPosition += 10
            }
            
            doc.setFontSize(12)
            if (block.description) {
              const splitDesc = doc.splitTextToSize(block.description, 170)
              doc.text(splitDesc, 20, yPosition)
              yPosition += splitDesc.length * 7 + 5
            }
            
            // Adiciona mais conteúdo específico para cada tipo de bloco
            // ...
            
            yPosition += 10
            break
            
          case 'video':
          case 'simulation':
          case 'link':
            doc.setFontSize(14)
            if (block.title) {
              doc.text(block.title, 20, yPosition)
              yPosition += 10
            }
            
            doc.setFontSize(12)
            if (block.description) {
              const splitDesc = doc.splitTextToSize(block.description, 170)
              doc.text(splitDesc, 20, yPosition)
              yPosition += splitDesc.length * 7 + 5
            }
            
            // Referência ao recurso externo
            doc.setFontSize(10)
            doc.setTextColor(0, 0, 255)
            if (block.url) {
              doc.text(`Recurso: ${block.url}`, 20, yPosition)
              yPosition += 10
            }
            
            doc.setTextColor(0)
            break
        }
        
        // Nova página se necessário
        if (yPosition > 270) {
          doc.addPage()
          yPosition = 20
        }
      })
      
      return doc.output('blob')
    } catch (error) {
      console.error('Erro ao exportar para PDF:', error)
      throw error
    }
  }

  /**
   * Exporta o conteúdo para HTML
   * @param content Conteúdo a ser exportado
   * @param options Opções de exportação
   * @returns Promise com o HTML como string
   */
  private async exportToHTML(content: Content, options: ExportOptions): Promise<string> {
    try {
      let html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.metadata.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #2a4b8d; }
    .block { margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
    .video-container { position: relative; padding-bottom: 56.25%; height: 0; }
    .video-container iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
    ${options.customStyles || ''}
  </style>
</head>
<body>
  <header>
    <h1>${content.metadata.title}</h1>
    ${content.metadata.description ? `<p>${content.metadata.description}</p>` : ''}
    <div class="metadata">
      <p>Versão: ${content.version.number}</p>
      <p>Última atualização: ${content.version.updatedAt.toLocaleDateString()}</p>
      <p>Autor: ${content.version.author}</p>
    </div>
  </header>
  <main>`
      
      // Adiciona conteúdo dos blocos
      content.blocks.forEach(block => {
        html += `<div class="block block-${block.type}">`
        
        switch(block.type) {
          case 'text':
            if (block.title) {
              html += `<h2>${block.title}</h2>`
            }
            html += `<div class="content">${block.content}</div>`
            break
            
          case 'video':
            if (block.title) {
              html += `<h2>${block.title}</h2>`
            }
            if (block.description) {
              html += `<p>${block.description}</p>`
            }
            
            // Embedding de vídeo
            if (block.url) {
              // Suporta YouTube e outros provedores
              if (block.url.includes('youtube.com') || block.url.includes('youtu.be')) {
                const videoId = this.extractYouTubeId(block.url)
                html += `
                <div class="video-container">
                  <iframe 
                    src="https://www.youtube.com/embed/${videoId}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen>
                  </iframe>
                </div>`
              } else {
                html += `<p><a href="${block.url}" target="_blank">Acessar vídeo</a></p>`
              }
            }
            break
            
          case 'quiz':
            if (block.title) {
              html += `<h2>${block.title}</h2>`
            }
            if (block.description) {
              html += `<p>${block.description}</p>`
            }
            
            // Renderiza as questões
            if (block.questions && block.questions.length > 0) {
              html += `<div class="quiz">`
              
              block.questions.forEach((question, qIndex) => {
                html += `
                <div class="question">
                  <p><strong>Questão ${qIndex + 1}:</strong> ${question.text}</p>
                  <div class="options">`
                
                question.options.forEach((option, oIndex) => {
                  // Em exportações, mostramos direto a resposta correta
                  const isCorrect = oIndex === question.correctOption
                  html += `
                  <div class="option ${isCorrect ? 'correct' : ''}">
                    <input type="radio" id="q${qIndex}_o${oIndex}" name="q${qIndex}" ${isCorrect ? 'checked' : ''} disabled>
                    <label for="q${qIndex}_o${oIndex}" ${isCorrect ? 'style="font-weight: bold;"' : ''}>${option}</label>
                    ${isCorrect ? ' ✓' : ''}
                  </div>`
                })
                
                html += `</div></div>`
              })
              
              html += `</div>`
            }
            break
            
          // Implementação similar para outros tipos de blocos
          // ...

          default:
            if (block.title) {
              html += `<h2>${block.title}</h2>`
            }
            if (block.description) {
              html += `<p>${block.description}</p>`
            }
            break
        }
        
        html += `</div>`
      })
      
      html += `
  </main>
  <footer>
    <p>Gerado pela Plataforma Edunéxia - ${new Date().toLocaleDateString()}</p>
  </footer>
</body>
</html>`
      
      return html
    } catch (error) {
      console.error('Erro ao exportar para HTML:', error)
      throw error
    }
  }

  /**
   * Exporta o conteúdo para SCORM
   * @param content Conteúdo a ser exportado
   * @param options Opções de exportação
   * @returns Promise com a URL do pacote SCORM
   */
  private async exportToSCORM(content: Content, options: ExportOptions): Promise<string> {
    try {
      // Importa JSZip dinamicamente para não afetar o bundle principal
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();
      
      // Adiciona arquivos base do SCORM
      
      // 1. Manifesto (imsmanifest.xml)
      const manifest = this.generateSCORMManifest(content);
      zip.file("imsmanifest.xml", manifest);
      
      // 2. Schemas XSD
      zip.file("adlcp_rootv1p2.xsd", await this.fetchSCORMSchema('adlcp_rootv1p2.xsd'));
      zip.file("imscp_rootv1p1p2.xsd", await this.fetchSCORMSchema('imscp_rootv1p1p2.xsd'));
      zip.file("imsmd_rootv1p2p1.xsd", await this.fetchSCORMSchema('imsmd_rootv1p2p1.xsd'));
      
      // 3. Conteúdo HTML
      const htmlContent = await this.generateSCORMContent(content, options);
      zip.file("index.html", htmlContent);
      
      // 4. JavaScript SCORM API
      const apiWrapper = await this.generateSCORMApiWrapper();
      zip.file("scorm_api_wrapper.js", apiWrapper);
      
      // 5. Recursos
      // Cria diretório para recursos
      const resourcesDir = zip.folder("resources");
      
      // Adiciona CSS e JavaScript necessários
      resourcesDir.file("styles.css", this.generateSCORMStyles());
      
      // Adiciona imagens e outros recursos
      for (const block of content.blocks) {
        if (block.type === 'image' && block.url) {
          try {
            // Baixa a imagem e adiciona ao ZIP
            const response = await fetch(block.url);
            const blob = await response.blob();
            const filename = block.url.split('/').pop() || `image_${Date.now()}.jpg`;
            resourcesDir.file(filename, blob);
          } catch (error) {
            console.warn(`Não foi possível adicionar a imagem ${block.url}:`, error);
          }
        }
      }
      
      // Gera o arquivo ZIP
      const blob = await zip.generateAsync({ type: "blob" });
      
      // Cria uma URL para o blob
      const url = URL.createObjectURL(blob);
      
      // Na implementação real, você pode salvar isso em um serviço de armazenamento
      // e retornar a URL permanente.
      
      return url;
    } catch (error) {
      console.error('Erro ao exportar para SCORM:', error);
      throw error;
    }
  }
  
  /**
   * Gera o manifesto SCORM (imsmanifest.xml)
   * @param content Conteúdo do curso
   * @returns XML do manifesto
   */
  private generateSCORMManifest(content: Content): string {
    const identifier = `COURSE_${content.id.replace(/\W/g, '_')}`;
    const title = content.metadata.title;
    const description = content.metadata.description || '';
    const version = content.version.number;
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${identifier}" version="${version}"
          xmlns="http://www.imsproject.org/xsd/imscp_rootv1p1p2"
          xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_rootv1p2"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.imsproject.org/xsd/imscp_rootv1p1p2 imscp_rootv1p1p2.xsd
                              http://www.adlnet.org/xsd/adlcp_rootv1p2 adlcp_rootv1p2.xsd">
  <metadata>
    <schema>ADL SCORM</schema>
    <schemaversion>1.2</schemaversion>
    <lom xmlns="http://www.imsglobal.org/xsd/imsmd_rootv1p2p1">
      <general>
        <title>
          <langstring xml:lang="pt-BR">${this.escapeXml(title)}</langstring>
        </title>
        <description>
          <langstring xml:lang="pt-BR">${this.escapeXml(description)}</langstring>
        </description>
      </general>
      <lifecycle>
        <version>
          <langstring xml:lang="pt-BR">${version}</langstring>
        </version>
        <status>
          <source>
            <langstring xml:lang="pt-BR">LOMv1.0</langstring>
          </source>
          <value>
            <langstring xml:lang="pt-BR">Final</langstring>
          </value>
        </status>
      </lifecycle>
      <technical>
        <format>text/html</format>
        <requirement>
          <type>
            <source>
              <langstring xml:lang="pt-BR">LOMv1.0</langstring>
            </source>
            <value>
              <langstring xml:lang="pt-BR">Browser</langstring>
            </value>
          </type>
          <name>
            <source>
              <langstring xml:lang="pt-BR">LOMv1.0</langstring>
            </source>
            <value>
              <langstring xml:lang="pt-BR">Any</langstring>
            </value>
          </name>
        </requirement>
      </technical>
    </lom>
  </metadata>
  <organizations default="TOC1">
    <organization identifier="TOC1">
      <title>${this.escapeXml(title)}</title>
      <item identifier="ITEM1" identifierref="RESOURCE1">
        <title>${this.escapeXml(title)}</title>
      </item>
    </organization>
  </organizations>
  <resources>
    <resource identifier="RESOURCE1" type="webcontent" adlcp:scormtype="sco" href="index.html">
      <file href="index.html" />
      <file href="scorm_api_wrapper.js" />
      <file href="resources/styles.css" />
    </resource>
  </resources>
</manifest>`;
  }
  
  /**
   * Gera o conteúdo HTML para o pacote SCORM
   * @param content Conteúdo do curso
   * @param options Opções de exportação
   * @returns HTML completo
   */
  private async generateSCORMContent(content: Content, options: ExportOptions): Promise<string> {
    const html = await this.exportToHTML(content, options);
    
    // Modifica o HTML para incluir a API do SCORM
    const scormHtml = html.replace('</head>',
      `  <script src="scorm_api_wrapper.js"></script>
  <script>
    // Inicialização do SCORM
    var scorm;
    
    function initializeSCORM() {
      scorm = new SCORM_API_wrapper();
      var result = scorm.initialize();
      
      if (result) {
        // Inicialização bem-sucedida
        console.log("SCORM API inicializada com sucesso");
        
        // Define o status como incompleto
        scorm.setValue("cmi.core.lesson_status", "incomplete");
        
        // Recupera o nome do aluno, se disponível
        var studentName = scorm.getValue("cmi.core.student_name");
        if (studentName && studentName !== "") {
          document.getElementById("student-name").textContent = "Bem-vindo, " + studentName;
        }
      } else {
        console.error("Falha na inicialização da API SCORM");
      }
    }
    
    function completeSCORM() {
      if (scorm) {
        scorm.setValue("cmi.core.lesson_status", "completed");
        scorm.setValue("cmi.core.score.raw", "100");
        scorm.terminate();
      }
    }
    
    // Inicializa o SCORM quando a página carregar
    window.onload = initializeSCORM;
    
    // Finaliza o SCORM quando a página for fechada
    window.onunload = completeSCORM;
  </script>
</head>`);
    
    // Adiciona elemento para mostrar o nome do aluno
    const bodyWithStudentName = scormHtml.replace('<body>', 
      '<body>\n  <div id="student-name"></div>');
    
    return bodyWithStudentName;
  }
  
  /**
   * Gera o wrapper da API SCORM
   * @returns JavaScript do wrapper da API SCORM
   */
  private async generateSCORMApiWrapper(): Promise<string> {
    // Versão simplificada da API SCORM 1.2
    return `/*
 * SCORM API Wrapper - versão simplificada para SCORM 1.2
 */
function SCORM_API_wrapper() {
  // Busca a API SCORM fornecida pelo LMS
  var findAPI = function(win) {
    var findAPITries = 0;
    while ((win.API == null) && (win.parent != null) && (win.parent != win) && (findAPITries < 10)) {
      findAPITries++;
      win = win.parent;
    }
    return win.API;
  };
  
  // Referência à API SCORM
  this.api = findAPI(window);
  
  // Inicializa a comunicação com o LMS
  this.initialize = function() {
    if (this.api) {
      return this.api.LMSInitialize("");
    }
    return false;
  };
  
  // Finaliza a comunicação com o LMS
  this.terminate = function() {
    if (this.api) {
      return this.api.LMSFinish("");
    }
    return false;
  };
  
  // Recupera um valor do LMS
  this.getValue = function(parameter) {
    if (this.api) {
      return this.api.LMSGetValue(parameter);
    }
    return "";
  };
  
  // Define um valor no LMS
  this.setValue = function(parameter, value) {
    if (this.api) {
      return this.api.LMSSetValue(parameter, value);
    }
    return false;
  };
  
  // Salva alterações
  this.commit = function() {
    if (this.api) {
      return this.api.LMSCommit("");
    }
    return false;
  };
  
  // Recupera o último erro
  this.getLastError = function() {
    if (this.api) {
      return this.api.LMSGetLastError();
    }
    return "0";
  };
  
  // Recupera a mensagem de erro
  this.getErrorString = function(errorCode) {
    if (this.api) {
      return this.api.LMSGetErrorString(errorCode);
    }
    return "";
  };
}`;
  }
  
  /**
   * Gera os estilos CSS para o pacote SCORM
   * @returns CSS
   */
  private generateSCORMStyles(): string {
    return `
body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

#student-name {
  background-color: #f5f5f5;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  font-weight: bold;
}

h1, h2, h3 {
  color: #2a4b8d;
}

.block {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 20px;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%;
  height: 0;
  margin-bottom: 20px;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.quiz {
  background-color: #f9f9f9;
  border-radius: 5px;
  padding: 15px;
  margin: 20px 0;
}

.question {
  margin-bottom: 15px;
}

.options {
  margin-left: 20px;
}

.option {
  margin: 5px 0;
}

.option.correct {
  color: #4caf50;
}

a {
  color: #2a4b8d;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.metadata {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 30px;
}
`;
  }
  
  /**
   * Busca um esquema XSD do SCORM
   * @param schemaName Nome do arquivo do esquema
   * @returns Conteúdo do esquema
   */
  private async fetchSCORMSchema(schemaName: string): Promise<string> {
    // Na implementação real, esses schemas deveriam ser armazenados localmente
    // ou buscados de uma fonte confiável
    
    // Simulação para fins de demonstração:
    // Retorna um template simples do schema solicitado
    return `<?xml version="1.0" encoding="UTF-8"?>
<!-- Esquema ${schemaName} simplificado para demonstração -->
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  <xs:element name="schema">
    <xs:complexType>
      <xs:sequence>
        <xs:element name="version" type="xs:string"/>
      </xs:sequence>
    </xs:complexType>
  </xs:element>
</xs:schema>`;
  }
  
  /**
   * Escapa caracteres especiais XML
   * @param text Texto para escapar
   * @returns Texto escapado
   */
  private escapeXml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
  
  /**
   * Extrai ID de vídeo do YouTube de uma URL
   * @param url URL do YouTube
   * @returns ID do vídeo
   */
  private extractYouTubeId(url: string): string {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[7].length === 11) ? match[7] : ''
  }
}

export const exportService = ExportService.getInstance() 