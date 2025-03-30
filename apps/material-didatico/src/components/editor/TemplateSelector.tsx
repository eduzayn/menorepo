import React, { useState } from 'react';
import { Template, ALL_TEMPLATES, templateToContent } from '@/data/templates';
import { Content } from '@/types/editor';
import { Button } from '@/components/ui/button';
import { Search, BookOpen, FileText, Layers, Tag } from 'lucide-react';

interface TemplateSelectorProps {
  onSelectTemplate: (content: Content) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Template['category'] | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  
  // Filtrar templates com base na pesquisa e categoria
  const filteredTemplates = ALL_TEMPLATES.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Agrupar templates por categoria para exibição
  const templatesByCategory = filteredTemplates.reduce<Record<string, Template[]>>((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    
    acc[template.category].push(template);
    return acc;
  }, {});
  
  // Aplicar template selecionado
  const applyTemplate = () => {
    if (selectedTemplate) {
      const newContent = templateToContent(selectedTemplate);
      onSelectTemplate(newContent);
    }
  };
  
  // Renderizar lista de templates
  const renderTemplateList = () => {
    if (filteredTemplates.length === 0) {
      return (
        <div className="p-8 text-center">
          <p className="text-gray-500">Nenhum template encontrado para "{searchQuery}"</p>
        </div>
      );
    }
    
    return Object.entries(templatesByCategory).map(([category, templates]) => (
      <div key={category} className="mb-6">
        <h3 className="text-lg font-medium mb-2 capitalize">{category}</h3>
        <div className="grid gap-3">
          {templates.map(template => (
            <div 
              key={template.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                selectedTemplate?.id === template.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              onClick={() => setSelectedTemplate(template)}
            >
              <h4 className="font-medium">{template.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{template.description}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {template.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    ));
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold mb-4">Templates Pedagógicos</h2>
        
        {/* Barra de pesquisa */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md"
          />
        </div>
        
        {/* Filtros de categoria */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            <Layers className="h-4 w-4 mr-1" />
            Todos
          </Button>
          <Button
            variant={selectedCategory === 'aula' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('aula')}
          >
            <FileText className="h-4 w-4 mr-1" />
            Aulas
          </Button>
          <Button
            variant={selectedCategory === 'disciplina' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('disciplina')}
          >
            <BookOpen className="h-4 w-4 mr-1" />
            Disciplinas
          </Button>
          <Button
            variant={selectedCategory === 'avaliação' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('avaliação')}
          >
            <FileText className="h-4 w-4 mr-1" />
            Avaliações
          </Button>
        </div>
      </div>
      
      {/* Lista de templates */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTemplateList()}
      </div>
      
      {/* Ações */}
      <div className="p-4 border-t">
        <Button
          variant="default"
          size="sm"
          disabled={!selectedTemplate}
          onClick={applyTemplate}
          className="w-full"
        >
          Aplicar Template
        </Button>
      </div>
    </div>
  );
} 