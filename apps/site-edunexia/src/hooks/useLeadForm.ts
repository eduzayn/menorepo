import { useState } from 'react';
import { ApiClient } from '@edunexia/api-client/src/client';
import { LeadInput, saveLead } from '../services/leads-service';

export interface LeadFormState {
  formData: LeadInput;
  isLoading: boolean;
  formStatus: 'idle' | 'success' | 'error';
  errorMessage: string;
}

export interface LeadFormHandlers {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  resetForm: () => void;
}

/**
 * Hook para gerenciar formulários de captação de leads
 * @param initialSource Fonte do lead (para rastreamento)
 * @param onSuccess Callback opcional para execução após envio bem-sucedido
 * @param onError Callback opcional para execução após erro
 * @returns Estado e manipuladores do formulário
 */
export const useLeadForm = (
  initialSource: string = 'website_contact_form',
  onSuccess?: () => void,
  onError?: (error: any) => void
): [LeadFormState, LeadFormHandlers] => {
  // Estado inicial do formulário
  const [formState, setFormState] = useState<LeadFormState>({
    formData: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
      source: initialSource
    },
    isLoading: false,
    formStatus: 'idle',
    errorMessage: ''
  });

  // Cliente API para envio dos dados
  // Em produção, usaríamos um hook ou context
  // Por enquanto, usamos um cliente mock para demonstração
  const apiClient = {
    from: (table: string) => ({
      insert: (data: any) => ({
        select: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    }),
    handleError: (error: any, context: string) => {
      console.error(`API error in ${context}:`, error);
      return {
        message: 'Ocorreu um erro ao processar sua solicitação.',
        code: 'UNKNOWN_ERROR',
        details: error
      };
    }
  } as ApiClient;

  // Manipulador de alterações nos campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      formData: {
        ...prev.formData,
        [name]: value
      }
    }));
  };

  // Manipulador de envio do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormState(prev => ({
      ...prev,
      isLoading: true,
      formStatus: 'idle',
      errorMessage: ''
    }));

    try {
      const { lead, error } = await saveLead(apiClient, formState.formData);
      
      if (error) throw error;
      
      // Sucesso
      setFormState(prev => ({
        ...prev,
        formData: {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          source: initialSource
        },
        isLoading: false,
        formStatus: 'success'
      }));
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error submitting lead form:', error);
      
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        formStatus: 'error',
        errorMessage: 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.'
      }));
      
      if (onError) onError(error);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormState({
      formData: {
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        source: initialSource
      },
      isLoading: false,
      formStatus: 'idle',
      errorMessage: ''
    });
  };

  return [
    formState,
    { handleChange, handleSubmit, resetForm }
  ];
}; 