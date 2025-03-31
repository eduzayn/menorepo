import { useState } from 'react';

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
    interest: 'geral',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulação de envio do formulário - será integrado com API real
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Limpar formulário e mostrar mensagem de sucesso
      setFormState({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
        interest: 'geral',
      });
      setSubmitSuccess(true);
    } catch (error) {
      setSubmitError('Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-primary-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Estamos prontos para transformar a gestão da sua instituição de ensino.
            Preencha o formulário abaixo para conversarmos.
          </p>
        </div>
      </section>

      {/* Formulário de Contato */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary-800 mb-4">Mensagem Enviada!</h2>
                <p className="text-gray-700 mb-8">
                  Agradecemos seu contato. Um membro da nossa equipe entrará em contato em breve.
                </p>
                <button
                  onClick={() => setSubmitSuccess(false)}
                  className="py-2 px-6 bg-primary-600 text-white font-medium rounded-md shadow-md hover:bg-primary-700 transition-colors"
                >
                  Enviar Outra Mensagem
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                      Nome Completo*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formState.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                      E-mail*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formState.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formState.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                      Instituição de Ensino
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formState.company}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="interest" className="block text-gray-700 font-medium mb-2">
                      Interesse Principal
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formState.interest}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="geral">Informações Gerais</option>
                      <option value="demo">Agendar Demonstração</option>
                      <option value="precos">Consulta de Preços</option>
                      <option value="suporte">Suporte Técnico</option>
                      <option value="parceria">Proposta de Parceria</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                      Mensagem*
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formState.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>

                {submitError && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {submitError}
                  </div>
                )}

                <div className="mt-8 text-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`py-3 px-8 bg-primary-600 text-white font-medium rounded-md shadow-md hover:bg-primary-700 transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Informações de Contato */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-primary-800 mb-12">
            Outras Formas de Contato
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Email */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">E-mail</h3>
              <p className="text-gray-600 mb-2">Para dúvidas gerais:</p>
              <a href="mailto:contato@edunexia.com.br" className="text-primary-600 font-medium hover:underline">
                contato@edunexia.com.br
              </a>
              <p className="text-gray-600 mt-2 mb-2">Para suporte técnico:</p>
              <a href="mailto:suporte@edunexia.com.br" className="text-primary-600 font-medium hover:underline">
                suporte@edunexia.com.br
              </a>
            </div>
            
            {/* Telefone */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Telefone</h3>
              <p className="text-gray-600 mb-2">Central de Atendimento:</p>
              <a href="tel:+551133335555" className="text-primary-600 font-medium hover:underline">
                (11) 3333-5555
              </a>
              <p className="text-gray-600 mt-2 mb-2">Vendas:</p>
              <a href="tel:+551133336666" className="text-primary-600 font-medium hover:underline">
                (11) 3333-6666
              </a>
            </div>
            
            {/* Endereço */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Endereço</h3>
              <p className="text-gray-600">
                Av. Paulista, 1000, 10º andar<br />
                Bela Vista - São Paulo - SP<br />
                CEP: 01310-100<br />
                Brasil
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 