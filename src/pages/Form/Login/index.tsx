import { useState, useEffect } from 'react'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../../../state/hook/useAuth ';
import './Login.scss';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { entrar } = useAutenticacao();

  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []); 

  const onSubmit = async (data: LoginFormData) => {
    const mensagem = await entrar(data.email, data.senha);

    if (mensagem) {
      setAuthError(mensagem); 
      return;
    }

    setAuthError(null);
    navigate('/');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="icon-wrapper">
              <i className="bi bi-person-circle"></i>
            </div>
            <h1>Bem-vindo de volta!</h1>
            <p>Entre na sua conta UrbanMart</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-wrapper">
                <i className="bi bi-envelope"></i>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  placeholder="seu@email.com"
                  className={errors.email ? 'error' : ''}
                />
              </div>
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <div className="input-wrapper">
                <i className="bi bi-lock"></i>
                <input
                  {...register('senha')}
                  type="password"
                  id="senha"
                  placeholder="••••••••"
                  className={errors.senha ? 'error' : ''}
                />
              </div>
              {errors.senha && (
                <span className="error-message">{errors.senha.message}</span>
              )}
            </div>

            {authError && (
              <p className="error-message auth-error">
                {authError}
              </p>
            )}

            <button type="submit" className="btn-login" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="login-footer">
            <div className="divider">
              <span>ou</span>
            </div>
            <p className="signup-text">
              Ainda não tem uma conta?{' '}
              <Link to="/cadastro" className="signup-link">
                Criar conta
              </Link>
            </p>
            <Link to="/" className="back-home">
              <i className="bi bi-arrow-left"></i> Voltar para home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;