import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAutenticacao } from '../../../state/hook/useAuth ';
import { useRecoilState } from 'recoil';
import { cepAtom, enderecoAtom } from '../../../state/authState';
import { useEffect, useState } from 'react';
import './Cadastro.scss';

const cadastroSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  cep: z.string().regex(/^\d{8}$/, 'CEP deve conter 8 dígitos'),
  endereco: z.string().min(5, 'Endereço é obrigatório'),
  senha: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type CadastroFormData = z.infer<typeof cadastroSchema>;

const Cadastro = () => {
  const navigate = useNavigate();
  const { cadastrar } = useAutenticacao();

  const [cep, setCep] = useRecoilState(cepAtom);
  const [endereco, setEndereco] = useRecoilState(enderecoAtom);
  const [authError, setAuthError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
  });

  const cepValue = watch('cep');

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []);

  const buscarEnderecoPorCep = async (cep: string) => {
    const cepNumerico = cep.replace(/\D/g, '');

    if (cepNumerico.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepNumerico}/json/`
        );
        const dados = await response.json();

        if (!dados.erro) {
          const enderecoCompleto = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
          setEndereco(enderecoCompleto);
          setValue('endereco', enderecoCompleto);
        } else {
          setEndereco('');
        }
      } catch (error) {
        console.error('Erro ao buscar endereço:', error);
      }
    }
  };

  useEffect(() => {
    if (cepValue && cepValue.length === 8) {
      buscarEnderecoPorCep(cepValue);
    }
  }, [cepValue]);

  const onSubmit = async (data: CadastroFormData) => {
    // Limpar mensagens anteriores
    setAuthError(null);
    setSuccessMessage(null);

    setCep(data.cep);
    setEndereco(data.endereco);

    const mensagem = await cadastrar(
      data.nome,
      data.email,
      data.cep,
      data.endereco,
      data.senha
    );

    if (mensagem) {
      setAuthError(mensagem);
      return;
    }

    // Mostrar mensagem de sucesso
    setSuccessMessage('Cadastro realizado com sucesso!');
    
    // Log para debug
    console.log(' SUCESSO! Usando classe: success-message');
    
    // Redirecionar após 2 segundos
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };

  return (
    <div className="cadastro-page">
      <div className="cadastro-container">
        <div className="cadastro-card">
          <div className="cadastro-header">
            <div className="icon-wrapper">
              <i className="bi bi-person-plus-fill"></i>
            </div>
            <h1>Criar Conta</h1>
            <p>Junte-se à UrbanMart</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="cadastro-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <div className="input-wrapper">
                  <i className="bi bi-person"></i>
                  <input
                    {...register('nome')}
                    type="text"
                    id="nome"
                    placeholder="Seu nome completo"
                    className={errors.nome ? 'error' : ''}
                  />
                </div>
                {errors.nome && (
                  <span className="error-message">{errors.nome.message}</span>
                )}
              </div>

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
                <label htmlFor="cep">CEP</label>
                <div className="input-wrapper">
                  <i className="bi bi-mailbox"></i>
                  <input
                    {...register('cep')}
                    type="text"
                    id="cep"
                    placeholder="00000000"
                    maxLength={8}
                    className={errors.cep ? 'error' : ''}
                  />
                </div>
                {errors.cep && (
                  <span className="error-message">{errors.cep.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="endereco">Endereço</label>
                <div className="input-wrapper">
                  <i className="bi bi-geo-alt"></i>
                  <input
                    {...register('endereco')}
                    type="text"
                    id="endereco"
                    placeholder="Endereço será preenchido automaticamente"
                    className={errors.endereco ? 'error' : ''}
                  />
                </div>
                {errors.endereco && (
                  <span className="error-message">
                    {errors.endereco.message}
                  </span>
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
            </div>

            {authError && (
              <div className="auth-error">
                <i className="bi bi-x-circle-fill me-2"></i>
                {authError}
              </div>
            )}

            {successMessage && (
              <div className="success-message">
                <i className="bi bi-check-circle-fill me-2"></i>
                {successMessage}
              </div>
            )}

            <button
              type="submit"
              className="btn-cadastro"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </button>
          </form>

          <div className="cadastro-footer">
            <div className="divider">
              <span>ou</span>
            </div>
            <p className="login-text">
              Já tem uma conta?{' '}
              <Link to="/login" className="login-link">
                Fazer login
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

export default Cadastro;