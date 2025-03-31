import React from 'react';
import { Card } from '@edunexia/ui-components';

export default function ConversacoesPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Conversações</h1>
      
      <p className="mb-6">Esta é a página de gerenciamento de conversações.</p>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Lista de Conversações</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Maria Silva</h3>
                <p className="text-sm text-gray-600">Olá, gostaria de saber mais sobre o curso de inglês</p>
              </div>
              <div className="text-sm text-gray-500">14:32</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">João Carlos</h3>
                <p className="text-sm text-gray-600">Preciso de ajuda com minha matrícula</p>
              </div>
              <div className="text-sm text-gray-500">12:15</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Pedro Almeida</h3>
                <p className="text-sm text-gray-600">Quando começa o próximo semestre?</p>
              </div>
              <div className="text-sm text-gray-500">Ontem</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 