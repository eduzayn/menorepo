import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  BuildingOfficeIcon, 
  PhoneIcon,
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp } = useAuth();
  
  // Obter o token de convite da URL se existir
  const queryParams = new URLSearchParams(location.search);
  const inviteToken = queryParams.get('token') || '';
  const inviteEmail = queryParams.get('email') || '';
  
  const [form, setForm] = useState({
    nome: '',
    email: inviteEmail,
    telefone: '',
    cargo: '',
    instituicao: '',
    senha: '',
    confirmarSenha: ''
  });
  
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações básicas
    if (form.senha !== form.confirmarSenha) {
      setError('As senhas não coincidem');
      return;
    }
    
    if (form.senha.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return;
    }
    
    setRegistering(true);
    setError(null);
    
    try {
      // Simulação de registro
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Em produção:
      // await signUp({
      //   email: form.email,
      //   password: form.senha,
      //   nome: form.nome,
      //   telefone: form.telefone,
      //   cargo: form.cargo,
      //   inviteToken
      // });
      
      // Redirecionar para login após o registro
      navigate('/login', { 
        state: { 
          message: 'Cadastro realizado com sucesso! Você já pode fazer login.' 
        } 
      });
    } catch (error) {
      console.error('Erro ao registrar:', error);
      setError('Não foi possível completar o registro. Verifique se o email já está cadastrado ou se o convite é válido.');
    } finally {
      setRegistering(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <img
            className="mx-auto h-12 w-auto"
            src="/logo.svg"
            alt="Edunéxia"
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {inviteToken 
            ? 'Complete seu cadastro para acessar o Portal do Parceiro' 
            : 'Cadastre-se para acessar o Portal do Parceiro'}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                Nome Completo
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="Seu nome completo"
                  value={form.nome}
                  onChange={handleChange}
                  disabled={registering}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-mail
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${inviteEmail ? 'bg-gray-50' : ''}`}
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!inviteEmail || registering}
                />
              </div>
              {inviteEmail && (
                <p className="mt-1 text-xs text-gray-500">Este e-mail foi pré-preenchido com base no seu convite</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                  Telefone
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="telefone"
                    name="telefone"
                    type="tel"
                    autoComplete="tel"
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="(00) 00000-0000"
                    value={form.telefone}
                    onChange={handleChange}
                    disabled={registering}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
                  Cargo
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    id="cargo"
                    name="cargo"
                    type="text"
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Seu cargo"
                    value={form.cargo}
                    onChange={handleChange}
                    disabled={registering}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700">
                Instituição
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BuildingOfficeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="instituicao"
                  name="instituicao"
                  type="text"
                  className={`focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md ${inviteToken ? 'bg-gray-50' : ''}`}
                  placeholder="Nome da instituição"
                  value={form.instituicao}
                  onChange={handleChange}
                  disabled={!!inviteToken || registering}
                />
              </div>
              {inviteToken && (
                <p className="mt-1 text-xs text-gray-500">Você será vinculado à instituição do convite</p>
              )}
            </div>
            
            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="senha"
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="********"
                  value={form.senha}
                  onChange={handleChange}
                  disabled={registering}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Mínimo de 8 caracteres</p>
            </div>
            
            <div>
              <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="confirmarSenha"
                  name="confirmarSenha"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  placeholder="********"
                  value={form.confirmarSenha}
                  onChange={handleChange}
                  disabled={registering}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                disabled={registering}
              >
                {registering ? 'Registrando...' : 'Cadastrar'}
              </button>
            </div>
            
            <div className="flex items-center justify-center">
              <div className="text-sm">
                <Link to="/login" className="font-medium text-primary hover:text-primary-dark flex items-center">
                  <ArrowLeftIcon className="mr-1 h-4 w-4" />
                  Já possui conta? Faça login
                </Link>
              </div>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Precisa de ajuda?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <a
                href="mailto:suporte@edunexia.com"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Contatar suporte
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 