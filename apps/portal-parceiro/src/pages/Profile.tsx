import React, { useState } from 'react';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  LockClosedIcon 
} from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

type ProfileForm = {
  nome: string;
  email: string;
  telefone: string;
  cargo: string;
  instituicao: string;
  bio: string;
};

type PasswordForm = {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
};

const Profile: React.FC = () => {
  const { user, profile, updateProfile, updatePassword } = useAuth();
  
  const [profileForm, setProfileForm] = useState<ProfileForm>({
    nome: profile?.nome || '',
    email: user?.email || '',
    telefone: profile?.telefone || '',
    cargo: profile?.cargo || '',
    instituicao: profile?.instituicao_nome || '',
    bio: profile?.bio || ''
  });
  
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });
  
  const [updating, setUpdating] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setAlert(null);
    
    try {
      // Simular atualização de perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em produção:
      // await updateProfile({
      //   nome: profileForm.nome,
      //   telefone: profileForm.telefone,
      //   cargo: profileForm.cargo,
      //   bio: profileForm.bio
      // });
      
      setAlert({
        type: 'success',
        message: 'Perfil atualizado com sucesso!'
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erro ao atualizar perfil. Por favor, tente novamente.'
      });
    } finally {
      setUpdating(false);
    }
  };
  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.novaSenha !== passwordForm.confirmarSenha) {
      setAlert({
        type: 'error',
        message: 'As senhas não coincidem'
      });
      return;
    }
    
    setChangingPassword(true);
    setAlert(null);
    
    try {
      // Simular atualização de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Em produção:
      // await updatePassword({
      //   currentPassword: passwordForm.senhaAtual,
      //   newPassword: passwordForm.novaSenha
      // });
      
      setAlert({
        type: 'success',
        message: 'Senha atualizada com sucesso!'
      });
      
      setPasswordForm({
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Erro ao atualizar senha. Verifique se a senha atual está correta.'
      });
    } finally {
      setChangingPassword(false);
    }
  };
  
  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
        <p className="mt-1 text-sm text-gray-500">
          Atualize suas informações pessoais e preferências
        </p>
      </div>
      
      {alert && (
        <div className={`mt-6 p-4 ${alert.type === 'success' ? 'bg-green-50 text-green-800 border-green-400' : 'bg-red-50 text-red-800 border-red-400'} border-l-4 rounded-md`}>
          {alert.message}
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        <div className="sm:col-span-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Informações do Perfil</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Dados pessoais e de contato</p>
              </div>
              <UserIcon className="h-8 w-8 text-primary" />
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handleProfileSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                      Nome Completo
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="nome"
                        id="nome"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={profileForm.nome}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      E-mail
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        value={profileForm.email}
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Para alterar o e-mail, contate o administrador</p>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                      Telefone
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="tel"
                        name="telefone"
                        id="telefone"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={profileForm.telefone}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="cargo" className="block text-sm font-medium text-gray-700">
                      Cargo
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="cargo"
                        id="cargo"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={profileForm.cargo}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="instituicao" className="block text-sm font-medium text-gray-700">
                      Instituição
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <BuildingOfficeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        name="instituicao"
                        id="instituicao"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md bg-gray-50"
                        value={profileForm.instituicao}
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Você está vinculado a esta instituição</p>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                      Bio / Informações Adicionais
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="bio"
                        name="bio"
                        rows={3}
                        className="shadow-sm focus:ring-primary focus:border-primary block w-full sm:text-sm border border-gray-300 rounded-md"
                        value={profileForm.bio}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Breve descrição sobre você.</p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 btn-primary"
                    disabled={updating}
                  >
                    {updating ? 'Salvando...' : 'Salvar Perfil'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="sm:col-span-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Segurança</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">Altere sua senha</p>
              </div>
              <LockClosedIcon className="h-8 w-8 text-primary" />
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <form onSubmit={handlePasswordSubmit}>
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700">
                      Senha Atual
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="senhaAtual"
                        id="senhaAtual"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={passwordForm.senhaAtual}
                        onChange={handlePasswordChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">
                      Nova Senha
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="novaSenha"
                        id="novaSenha"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={passwordForm.novaSenha}
                        onChange={handlePasswordChange}
                        minLength={8}
                        required
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Mínimo de 8 caracteres</p>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                      Confirmar Nova Senha
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                      </div>
                      <input
                        type="password"
                        name="confirmarSenha"
                        id="confirmarSenha"
                        className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        value={passwordForm.confirmarSenha}
                        onChange={handlePasswordChange}
                        minLength={8}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="ml-3 btn-primary"
                    disabled={changingPassword}
                  >
                    {changingPassword ? 'Alterando...' : 'Alterar Senha'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 