import React from 'react';
import { Card } from '../mock-components';

export default function MensagensPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Mensagens</h1>
      
      <p className="mb-6">Esta é a página de mensagens e comunicações.</p>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Caixa de Entrada</h2>
        <div className="space-y-4">
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Comunicado: Início das Aulas</h3>
                <p className="text-sm text-gray-600">Informamos que as aulas do próximo semestre começam no dia...</p>
              </div>
              <div className="text-sm text-gray-500">Hoje, 10:45</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Lembrete: Matrícula</h3>
                <p className="text-sm text-gray-600">Não esqueça de finalizar sua matrícula até o dia...</p>
              </div>
              <div className="text-sm text-gray-500">Ontem, 15:30</div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Feedback: Aula de Programação</h3>
                <p className="text-sm text-gray-600">Gostaríamos de saber sua opinião sobre a última aula...</p>
              </div>
              <div className="text-sm text-gray-500">10/05/2023</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 