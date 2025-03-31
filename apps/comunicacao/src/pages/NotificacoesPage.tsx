import React from 'react';
import { Card } from '../mock-components';

export default function NotificacoesPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Notificações</h1>
      
      <p className="mb-6">Acompanhe todas as suas notificações em um só lugar.</p>
      
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Notificações Recentes</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Nova mensagem recebida</h3>
                <p className="text-sm text-gray-600 mt-1">Você recebeu uma nova mensagem de Maria Silva sobre o curso de inglês.</p>
                <p className="text-xs text-gray-400 mt-2">12/05/2023, 14:32</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4 border-l-4 border-gray-300 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Lembrete de matrícula</h3>
                <p className="text-sm text-gray-600 mt-1">O período de matrículas para o próximo semestre termina em 3 dias.</p>
                <p className="text-xs text-gray-400 mt-2">11/05/2023, 09:15</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Lead qualificado</h3>
                <p className="text-sm text-gray-600 mt-1">O lead João Carlos foi automaticamente qualificado pelo sistema.</p>
                <p className="text-xs text-gray-400 mt-2">10/05/2023, 16:45</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 