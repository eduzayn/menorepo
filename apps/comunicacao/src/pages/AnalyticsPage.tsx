import React from 'react';
import { Card } from '@edunexia/ui-components';

export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>
      
      <p className="mb-6">Acompanhe as métricas e estatísticas do módulo de comunicação.</p>
      
      <div className="grid md:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Total de Conversas</h3>
          <p className="text-3xl font-bold">1,248</p>
          <p className="text-sm text-green-600">+12.5% este mês</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Tempo Médio de Resposta</h3>
          <p className="text-3xl font-bold">4.2 min</p>
          <p className="text-sm text-green-600">-0.8 min que o mês anterior</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Taxa de Resolução</h3>
          <p className="text-3xl font-bold">92%</p>
          <p className="text-sm text-green-600">+3% que o mês anterior</p>
        </Card>
        
        <Card className="p-4">
          <h3 className="font-semibold text-gray-700 mb-2">Satisfação</h3>
          <p className="text-3xl font-bold">4.8/5</p>
          <p className="text-sm text-green-600">+0.2 que o mês anterior</p>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Distribuição de Mensagens por Canal</h2>
          <div className="h-80 flex items-center justify-center">
            <div className="text-center">
              <div className="flex space-x-6">
                <div className="flex flex-col items-center">
                  <div className="h-40 w-12 bg-blue-500 rounded-t-lg"></div>
                  <p className="mt-2 text-sm">WhatsApp</p>
                  <p className="text-gray-500 text-xs">45%</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-28 w-12 bg-green-500 rounded-t-lg"></div>
                  <p className="mt-2 text-sm">Chat</p>
                  <p className="text-gray-500 text-xs">32%</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-20 w-12 bg-purple-500 rounded-t-lg"></div>
                  <p className="mt-2 text-sm">E-mail</p>
                  <p className="text-gray-500 text-xs">16%</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="h-10 w-12 bg-yellow-500 rounded-t-lg"></div>
                  <p className="mt-2 text-sm">SMS</p>
                  <p className="text-gray-500 text-xs">7%</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Horas de Pico</h2>
          <div className="h-80 flex items-center justify-center">
            <div className="w-full">
              <div className="relative h-40">
                <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200"></div>
                <div className="absolute bottom-1/4 left-0 w-full h-px bg-gray-100"></div>
                <div className="absolute bottom-2/4 left-0 w-full h-px bg-gray-100"></div>
                <div className="absolute bottom-3/4 left-0 w-full h-px bg-gray-100"></div>
                <div className="flex justify-between h-full items-end">
                  {[8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19].map((hour, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div 
                        className="w-4 bg-blue-400"
                        style={{ 
                          height: `${[15, 25, 40, 60, 75, 65, 40, 90, 80, 65, 45, 20][index]}%`
                        }}
                      ></div>
                      <p className="mt-2 text-xs">{hour}h</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 