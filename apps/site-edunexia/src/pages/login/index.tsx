import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@edunexia/auth';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './login.css';

/**
 * Esquema de validação do formulário de login
 */
const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email('E-mail inválido')
    .required('E-mail é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha deve ter no mínimo 6 caracteres')
    .required('Senha é obrigatória'),
});

/**
 * Página de Login Unificado para o sistema Edunéxia
 */
const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();
  
  /**
   * Manipula o processo de login
   */
  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    
    try {
      const { user, error: signInError } = await signIn(values.email, values.password);
      
      if (signInError) {
        throw signInError;
      }
      
      if (user) {
        // Após login bem-sucedido, redirecionar para o seletor de portais
        navigate('/portal-selector', { replace: true });
      }
    } catch (err) {
      setError('Credenciais inválidas. Por favor, tente novamente.');
      console.error('Erro no login:', err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-left">
          <img src="/logo-edunexia.svg" alt="Edunéxia" className="login-logo" />
          <h2 className="login-title">Portal Unificado</h2>
          <p className="login-description">
            Faça login para acessar todos os sistemas da Edunéxia através de uma única entrada.
          </p>
        </div>
        
        <div className="login-right">
          <h1 className="form-title">Acesso à Plataforma</h1>
          
          {error && <div className="error-message">{error}</div>}
          
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting }) => (
              <Form className="login-form">
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                  <ErrorMessage name="email" component="div" className="error-message" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Senha</label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    placeholder="••••••••"
                    className="form-input"
                  />
                  <ErrorMessage name="password" component="div" className="error-message" />
                </div>
                
                <div className="form-group remember-forgot">
                  <label className="remember-me">
                    <Field type="checkbox" name="remember" />
                    <span>Lembrar-me</span>
                  </label>
                  <a href="/recuperar-senha" className="forgot-password">
                    Esqueceu a senha?
                  </a>
                </div>
                
                <button
                  type="submit"
                  className="login-button"
                  disabled={isSubmitting || loading}
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </Form>
            )}
          </Formik>
          
          <div className="login-footer">
            <p>Não tem uma conta? <a href="/registrar">Cadastre-se</a></p>
            <p className="help-text">
              <a href="/ajuda">Precisa de ajuda?</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 