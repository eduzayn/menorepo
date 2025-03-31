import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';

// Interface para os dados de pagamento do Asaas
interface AsaasPaymentResponse {
  id: string;
  status: string;
  linkPagamento: string;
  pixCopiaECola?: string;
  qrCodeImage?: string;
  linhaDigitavel?: string;
  pdf?: string;
}

// Interface para o estado passado pela navegação
interface LocationState {
  planName?: string;
  institutionName?: string;
  email?: string;
  paymentId?: string;
  paymentInfo?: AsaasPaymentResponse;
}

const CheckoutSuccessPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState || {};
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0);
  }, []);

  // Se não houver informações no state, o usuário provavelmente acessou diretamente esta URL
  // Em uma implementação real, buscaríamos os dados do backend
  if (!state.planName || !state.institutionName) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-4">Informações não encontradas</h2>
            <p className="mb-4 text-gray-600">
              Não foi possível recuperar os detalhes da sua compra. Por favor, verifique seu email para mais informações ou entre em contato com o suporte.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Função para copiar o código PIX ou linha digitável para a área de transferência
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      },
      (err) => {
        console.error('Não foi possível copiar o texto: ', err);
      }
    );
  };

  // Função para cancelar assinatura (em caso de desistência durante teste)
  const cancelSubscription = async () => {
    if (!state.paymentId) return;
    
    try {
      await fetch('https://npiyusbnaaibibcucspv.supabase.co/functions/v1/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: state.paymentId
        }),
      });
      
      alert('Assinatura cancelada com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cancelar assinatura:', error);
      alert('Erro ao cancelar assinatura. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 text-center border-b border-gray-200">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Assinatura iniciada com sucesso!</h2>
            <p className="mt-1 text-sm text-gray-500">
              Seu período de teste gratuito de 14 dias começou agora
            </p>
          </div>
          
          {/* Detalhes da assinatura */}
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Detalhes da assinatura</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Plano</dt>
                    <dd className="mt-1 text-sm text-gray-900">{state.planName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Instituição</dt>
                    <dd className="mt-1 text-sm text-gray-900">{state.institutionName}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">E-mail</dt>
                    <dd className="mt-1 text-sm text-gray-900">{state.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-gray-500">ID da transação</dt>
                    <dd className="mt-1 text-sm text-gray-900">{state.paymentId || 'N/A'}</dd>
                  </div>
                </dl>
              </div>
            </div>
            
            {/* Informações de pagamento específicas do Asaas */}
            {state.paymentInfo && (
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Informações de pagamento</h3>
                <div className="bg-gray-50 rounded-md p-4">
                  {/* PIX */}
                  {state.paymentInfo.pixCopiaECola && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Pagamento via PIX</h4>
                      {state.paymentInfo.qrCodeImage && (
                        <div className="flex justify-center mb-4">
                          <img 
                            src={state.paymentInfo.qrCodeImage} 
                            alt="QR Code PIX" 
                            className="h-48 w-48"
                          />
                        </div>
                      )}
                      <div className="mb-4">
                        <label htmlFor="pix-code" className="block text-sm font-medium text-gray-700 mb-1">
                          Código PIX Copia e Cola
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <div className="relative flex items-stretch flex-grow">
                            <input
                              type="text"
                              id="pix-code"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 bg-gray-100"
                              value={state.paymentInfo.pixCopiaECola}
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={() => copyToClipboard(state.paymentInfo?.pixCopiaECola || '')}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        Abra o aplicativo do seu banco, escolha a opção de pagamento via PIX, e escaneie o QR code ou cole o código acima.
                      </p>
                    </div>
                  )}
                  
                  {/* Boleto */}
                  {state.paymentInfo.linhaDigitavel && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Pagamento via Boleto</h4>
                      <div className="mb-4">
                        <label htmlFor="boleto-code" className="block text-sm font-medium text-gray-700 mb-1">
                          Linha Digitável
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <div className="relative flex items-stretch flex-grow">
                            <input
                              type="text"
                              id="boleto-code"
                              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300 bg-gray-100"
                              value={state.paymentInfo.linhaDigitavel}
                              readOnly
                            />
                            <button
                              type="button"
                              onClick={() => copyToClipboard(state.paymentInfo?.linhaDigitavel || '')}
                              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                              {copied ? 'Copiado!' : 'Copiar'}
                            </button>
                          </div>
                        </div>
                      </div>
                      {state.paymentInfo.pdf && (
                        <div className="mt-4">
                          <a
                            href={state.paymentInfo.pdf}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Baixar Boleto
                          </a>
                        </div>
                      )}
                      <p className="mt-3 text-sm text-gray-500">
                        O boleto deve ser pago até o vencimento. Após o pagamento, pode levar até 3 dias úteis para a compensação.
                      </p>
                    </div>
                  )}
                  
                  {/* Cartão de Crédito */}
                  {!state.paymentInfo.pixCopiaECola && !state.paymentInfo.linhaDigitavel && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Pagamento via Cartão de Crédito</h4>
                      <p className="text-sm text-gray-900">
                        Seu pagamento via cartão de crédito foi processado com sucesso.
                      </p>
                      <p className="mt-1 text-sm text-gray-500">
                        Após o período de teste gratuito, seu cartão será debitado automaticamente conforme plano escolhido.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Próximos passos */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Próximos passos</h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                      1
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Verifique seu email</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Enviamos um email para {state.email} com instruções detalhadas para acessar a plataforma.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                      2
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Acesse a plataforma</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Utilize as credenciais fornecidas para acessar o painel administrativo da Edunéxia.
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                      3
                    </div>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">Configure sua instituição</h4>
                    <p className="mt-1 text-sm text-gray-500">
                      Complete o cadastro da sua instituição e comece a usar os módulos disponíveis.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Opção de cancelamento durante o período de trial */}
            <div className="mb-8">
              <button
                onClick={cancelSubscription}
                className="text-sm text-red-600 hover:text-red-500 font-medium underline"
              >
                Cancelar assinatura
              </button>
              <p className="mt-1 text-xs text-gray-500">
                Você pode cancelar sua assinatura a qualquer momento durante o período de teste gratuito.
              </p>
            </div>
            
            {/* Suporte */}
            <div className="rounded-md bg-blue-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Precisa de ajuda?</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Nossa equipe de suporte está disponível para ajudar em qualquer etapa do processo. Entre em contato através do email <a href="mailto:suporte@edunexia.com" className="font-medium underline">suporte@edunexia.com</a> ou pelo telefone (11) 4002-8922.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 flex justify-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Voltar à página inicial
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage; 