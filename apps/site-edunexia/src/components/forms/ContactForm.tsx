import { useState } from 'react';
import { ApiClient } from '@edunexia/api-client/src/client';
import { useApiClient } from '@edunexia/api-client';

interface ContactFormProps {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}

export function ContactForm({ onSuccess, onError }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    source: 'website_contact_form'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  // Get API client from context
  const apiClient = useApiClient();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus('idle');
    setErrorMessage('');

    try {
      // In development/testing mode, we simulate a successful submission
      const useMockData = true; // Would normally be an environment variable

      if (useMockData) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Store in sessionStorage for demo purposes
        const existingLeads = JSON.parse(sessionStorage.getItem('site_leads') || '[]');
        sessionStorage.setItem('site_leads', JSON.stringify([
          ...existingLeads,
          {
            id: `lead-${Date.now()}`,
            ...formData,
            created_at: new Date().toISOString(),
            status: 'new'
          }
        ]));
      } else {
        // In production, we would use the actual API client
        const { error } = await apiClient.from('site_leads')
          .insert([{
            ...formData,
            status: 'new'
          }]);
          
        if (error) throw error;
      }

      // Success handling
      setFormStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        source: 'website_contact_form'
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      // Error handling
      setFormStatus('error');
      setErrorMessage('Ocorreu um erro ao enviar seu contato. Por favor, tente novamente.');
      console.error('Contact form submission error:', error);
      
      if (onError) onError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      {formStatus === 'success' ? (
        <div className="rounded-lg bg-green-50 p-6 text-center">
          <h3 className="mb-2 text-xl font-medium text-green-800">Mensagem enviada com sucesso!</h3>
          <p className="text-green-700">
            Obrigado pelo seu contato. Nossa equipe retornará em breve.
          </p>
          <button
            className="mt-4 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={() => setFormStatus('idle')}
          >
            Enviar nova mensagem
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome completo *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Seu nome"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              E-mail *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="seu.email@exemplo.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="(00) 00000-0000"
            />
          </div>
          
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
              Assunto *
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            >
              <option value="">Selecione um assunto</option>
              <option value="information">Informações sobre cursos</option>
              <option value="support">Suporte</option>
              <option value="partnership">Parcerias</option>
              <option value="other">Outro</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700">
              Mensagem *
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={5}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              placeholder="Escreva sua mensagem aqui..."
            />
          </div>
          
          {formStatus === 'error' && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Erro no envio</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-75"
            >
              {isLoading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : 'Enviar mensagem'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 