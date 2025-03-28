export function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-primary-800 mb-6 text-center">
          Entre em Contato
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center">
          Estamos prontos para responder suas dúvidas e ajudar sua instituição a crescer com nossas soluções.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-primary-800 mb-6">
              Envie uma mensagem
            </h2>
            <form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="(00) 00000-0000"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-700 mb-1">
                  Instituição
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Nome da instituição"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Mensagem
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Como podemos ajudar?"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-md hover:bg-primary-700 transition"
              >
                Enviar mensagem
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <div className="bg-primary-50 rounded-lg p-8 mb-8">
              <h2 className="text-2xl font-bold text-primary-800 mb-6">
                Informações de Contato
              </h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-800 font-medium">Telefone</p>
                    <p className="text-gray-600">(11) 4000-0000</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-800 font-medium">E-mail</p>
                    <p className="text-gray-600">contato@edunexia.com.br</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-gray-800 font-medium">Endereço</p>
                    <p className="text-gray-600">
                      Av. Paulista, 1000 - Bela Vista<br />
                      São Paulo - SP, 01310-100
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-primary-800 mb-6">
                Horário de Atendimento
              </h2>
              <div className="space-y-2">
                <p className="text-gray-600"><span className="font-medium">Segunda a Sexta:</span> 9h às 18h</p>
                <p className="text-gray-600"><span className="font-medium">Sábados:</span> 9h às 13h</p>
                <p className="text-gray-600"><span className="font-medium">Domingos e Feriados:</span> Fechado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 