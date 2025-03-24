import { Link } from 'react-router-dom';

export function VerifyEmail() {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Verifique seu email
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Enviamos um link de verificação para seu email.
          Por favor, verifique sua caixa de entrada e clique no link para confirmar sua conta.
        </p>
      </div>

      <div className="rounded-md bg-blue-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Não recebeu o email?
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Verifique sua pasta de spam ou solicite um novo link de verificação.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm text-gray-600">
          Já verificou seu email?{' '}
          <Link
            to="/auth/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Entre aqui
          </Link>
        </p>
      </div>
    </div>
  );
} 