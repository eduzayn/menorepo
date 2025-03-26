/**
 * Exporta o conteúdo para PDF usando jsPDF
 * @param content Conteúdo a ser exportado
 * @returns URL do PDF gerado
 */
export async function exportToPDF(content: Content): Promise<string> {
  try {
    // Importação dinâmica do jsPDF para evitar problemas no servidor
    const { default: jsPDF } = await import('jspdf');
    
    // Criar nova instância do documento
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    // Definir margens e tamanhos
    const margin = 20; // mm
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);
    
    // Adicionar metadados ao documento
    doc.setProperties({
      title: content.metadata.title,
      subject: content.metadata.description || '',
      author: 'Edunéxia',
      keywords: content.metadata.tags?.join(', ') || '',
      creator: 'Edunéxia Material Didático'
    });
    
    // Posição vertical inicial
    let yPos = margin;
    
    // Adicionar título
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    
    const titleLines = doc.splitTextToSize(content.metadata.title, contentWidth);
    doc.text(titleLines, margin, yPos);
    yPos += 10 * titleLines.length;
    
    // Adicionar descrição, se existir
    if (content.metadata.description) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'italic');
      const descLines = doc.splitTextToSize(content.metadata.description, contentWidth);
      doc.text(descLines, margin, yPos);
      yPos += 6 * descLines.length;
    }
    
    // Adicionar metadados adicionais
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (content.metadata.education_level) {
      doc.text(`Nível: ${content.metadata.education_level}`, margin, yPos);
      yPos += 5;
    }
    
    if (content.metadata.estimated_duration) {
      doc.text(`Duração estimada: ${content.metadata.estimated_duration} minutos`, margin, yPos);
      yPos += 5;
    }
    
    if (content.metadata.learning_objectives && content.metadata.learning_objectives.length > 0) {
      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Objetivos de Aprendizagem:', margin, yPos);
      yPos += 5;
      
      doc.setFont('helvetica', 'normal');
      content.metadata.learning_objectives.forEach(objective => {
        const objLines = doc.splitTextToSize(`• ${objective}`, contentWidth);
        doc.text(objLines, margin, yPos);
        yPos += 5 * objLines.length;
      });
    }
    
    // Adicionar linha separadora
    yPos += 5;
    doc.setDrawColor(200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;
    
    // Processar cada bloco de conteúdo
    for (const block of content.blocks) {
      // Verificar se precisamos pular para a próxima página
      if (yPos > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage();
        yPos = margin;
      }
      
      // Título do bloco (se existir)
      if (block.title) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        const blockTitleLines = doc.splitTextToSize(block.title, contentWidth);
        doc.text(blockTitleLines, margin, yPos);
        yPos += 7 * blockTitleLines.length;
      }
      
      // Conteúdo específico para cada tipo de bloco
      switch (block.type) {
        case 'text':
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const textLines = doc.splitTextToSize(block.content, contentWidth);
          
          // Verificar se o texto precisa de nova página
          if (yPos + (textLines.length * 5) > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yPos = margin;
          }
          
          doc.text(textLines, margin, yPos);
          yPos += 5 * textLines.length + 10;
          break;
          
        case 'image':
          // Para blocos de imagem, precisaríamos inserir a imagem do URL ou base64
          // Este é um exemplo simplificado
          try {
            if (block.content) {
              const imgData = block.content;
              
              // Determinar dimensões da imagem mantendo proporção
              const imgWidth = contentWidth;
              const imgHeight = 80; // Altura arbitrária, idealmente calculada da imagem real
              
              doc.addImage(imgData, 'JPEG', margin, yPos, imgWidth, imgHeight);
              yPos += imgHeight + 10;
            }
          } catch (e) {
            console.error('Erro ao adicionar imagem:', e);
            // Adicionar texto de erro no lugar da imagem
            doc.setTextColor(255, 0, 0);
            doc.text('[Erro ao carregar imagem]', margin, yPos);
            doc.setTextColor(0);
            yPos += 10;
          }
          break;
          
        case 'video':
          // Para vídeos, adicionar referência ou QR code
          doc.setFontSize(11);
          doc.setFont('helvetica', 'italic');
          doc.text('[Vídeo] ' + (block.content || 'Link para vídeo externo'), margin, yPos);
          yPos += 10;
          break;
          
        case 'quiz':
        case 'activity':
        case 'simulation':
          // Para blocos interativos, adicionar descrição
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.text(`[${block.type}] ${block.content}`, margin, yPos);
          yPos += 10;
          break;
          
        case 'link':
          // Para links externos
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 255);
          doc.text(`Link: ${block.content}`, margin, yPos);
          doc.setTextColor(0);
          yPos += 10;
          break;
          
        default:
          // Tipo desconhecido, simplesmente adicionar o conteúdo como texto
          doc.setFontSize(11);
          doc.setFont('helvetica', 'normal');
          const unknownLines = doc.splitTextToSize(block.content, contentWidth);
          doc.text(unknownLines, margin, yPos);
          yPos += 5 * unknownLines.length + 5;
      }
      
      // Pequeno espaço entre blocos
      yPos += 5;
    }
    
    // Adicionar rodapé em todas as páginas
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Linha de rodapé
      const footerY = doc.internal.pageSize.getHeight() - 10;
      doc.setDrawColor(200);
      doc.line(margin, footerY - 3, pageWidth - margin, footerY - 3);
      
      // Texto de rodapé com número de página
      doc.setFontSize(8);
      doc.setTextColor(100);
      doc.text(`Material Didático Edunéxia | ${content.metadata.title} | Página ${i} de ${totalPages}`, 
        margin, footerY);
      doc.setTextColor(0);
    }
    
    // Salvar o PDF como blob e criar URL
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    return pdfUrl;
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    throw new Error('Falha ao exportar para PDF');
  }
} 