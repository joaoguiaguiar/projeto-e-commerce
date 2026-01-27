import React, { useState, useEffect } from 'react';
import { User, Edit2, Save, X, AlertCircle, CheckCircle } from 'lucide-react';
import styled from 'styled-components';
import '../AreaLogada.scss';

// Função de hash igual à do useAuth
const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
};

const Container = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 6px;
  }
`;

const Cabecalho = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
    gap: 0.5rem;
  }
`;

const Titulo = styled.h2`
  font-size: 1.875rem;
  font-weight: 700;
  color: #0A2647;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  word-wrap: break-word;

  @media (max-width: 1024px) {
    font-size: 1.75rem;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.375rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }

  svg {
    width: 28px;
    height: 28px;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }

    @media (max-width: 480px) {
      width: 22px;
      height: 22px;
    }
  }
`;

const BotaoEditar = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #0A2647;
  color: white;
  white-space: nowrap;

  @media (max-width: 768px) {
    width: 100%;
    padding: 0.75rem;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 0.625rem;
    font-size: 0.875rem;
  }

  &:hover {
    background: #144272;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(10, 38, 71, 0.3);
  }

  svg {
    width: 16px;
    height: 16px;

    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }
`;

const Mensagem = styled.div<{ $tipo: 'sucesso' | 'erro' }>`
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  word-wrap: break-word;
  
  @media (max-width: 768px) {
    padding: 0.875rem 1rem;
    margin-bottom: 1.25rem;
    font-size: 0.9375rem;
    gap: 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    flex-direction: column;
    text-align: center;
    gap: 0.375rem;
  }
  
  ${props => props.$tipo === 'sucesso' ? `
    background: #f0fdf4;
    color: #166534;
    border: 1px solid #bbf7d0;
  ` : `
    background: #fef2f2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;

    @media (max-width: 768px) {
      width: 18px;
      height: 18px;
    }

    @media (max-width: 480px) {
      width: 16px;
      height: 16px;
    }
  }
`;

const Formulario = styled.div`
  display: grid;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Campo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 600;
  color: #334155;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const Obrigatorio = styled.span`
  color: #dc2626;
  font-weight: bold;
`;

const Input = styled.input<{ disabled?: boolean }>`
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: ${props => props.disabled ? '#f8fafc' : 'white'};
  color: ${props => props.disabled ? '#94a3b8' : '#1e293b'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'text'};
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0.625rem 0.875rem;
    font-size: 0.9375rem;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 0.5625rem 0.75rem;
    font-size: 0.875rem;
    border-radius: 4px;
  }

  &:focus {
    outline: none;
    border-color: #0A2647;
    box-shadow: 0 0 0 3px rgba(10, 38, 71, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const Dica = styled.p`
  font-size: 0.75rem;
  color: #64748b;
  margin: 0;
  font-style: italic;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.6875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.625rem;
  }
`;

const Botoes = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.875rem;
    padding-top: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-top: 0.75rem;
    padding-top: 1rem;
  }
`;

const Botao = styled.button<{ $variant: 'salvar' | 'cancelar' }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  @media (max-width: 768px) {
    padding: 0.875rem;
    font-size: 0.9375rem;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    font-size: 0.875rem;
    border-radius: 4px;
  }

  ${props => props.$variant === 'salvar' ? `
    background: linear-gradient(135deg, #0A2647 0%, #144272 100%);
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(10, 38, 71, 0.3);
    }
  ` : `
    background: white;
    color: #64748b;
    border: 1px solid #e2e8f0;

    &:hover {
      background: #f8fafc;
      border-color: #cbd5e1;
      transform: translateY(-2px);
    }
  `}

  svg {
    width: 18px;
    height: 18px;

    @media (max-width: 768px) {
      width: 16px;
      height: 16px;
    }

    @media (max-width: 480px) {
      width: 14px;
      height: 14px;
    }
  }
`;

const Carregando = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  color: #64748b;
  text-align: center;
  word-wrap: break-word;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.75rem;
    font-size: 0.875rem;
  }
`;

const getUserFromStorage = () => {
  const userToken = localStorage.getItem('user_token');
  const usersStorage = localStorage.getItem('users_bd');
  
  if (userToken && usersStorage) {
    const userInfo = JSON.parse(userToken);
    const users = JSON.parse(usersStorage);
    return users.find((user: any) => user.email === userInfo.email);
  }
  return null;
};

const SeusDados = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cep: '',
    endereco: '',
    senha: ''
  });
  const [senhaAtual, setSenhaAtual] = useState('');
  const [mensagem, setMensagem] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const user = getUserFromStorage();
    if (user) {
      setUsuario(user);
      setFormData({
        nome: user.nome || '',
        email: user.email || '',
        cep: user.cep || '',
        endereco: user.endereco || '',
        senha: ''
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSalvar = async () => {
    try {
      setCarregando(true);
      
      if (!senhaAtual.trim()) {
        setMensagem({ tipo: 'erro', texto: 'Digite sua senha atual para confirmar!' });
        setCarregando(false);
        return;
      }

      if (!formData.nome.trim()) {
        setMensagem({ tipo: 'erro', texto: 'O nome é obrigatório!' });
        setCarregando(false);
        return;
      }

      if (!formData.cep.trim() || formData.cep.length !== 8) {
        setMensagem({ tipo: 'erro', texto: 'CEP inválido! Deve ter 8 dígitos.' });
        setCarregando(false);
        return;
      }

      const senhaAtualHash = await hashPassword(senhaAtual);
      
      if (senhaAtualHash !== usuario.senha) {
        setMensagem({ tipo: 'erro', texto: 'Senha atual incorreta!' });
        setCarregando(false);
        return;
      }

      const usersStorage = JSON.parse(localStorage.getItem('users_bd') || '[]');
      const userIndex = usersStorage.findIndex((u: any) => u.email === usuario.email);
      
      if (userIndex !== -1) {
        const novaSenha = formData.senha.trim() 
          ? await hashPassword(formData.senha) 
          : usuario.senha;
        
        const updatedUser = {
          ...usersStorage[userIndex],
          nome: formData.nome.trim(),
          cep: formData.cep.trim(),
          endereco: formData.endereco.trim(),
          senha: novaSenha
        };
        
        usersStorage[userIndex] = updatedUser;
        localStorage.setItem('users_bd', JSON.stringify(usersStorage));
        
        const { senha, ...userSemSenha } = updatedUser;
        setUsuario(userSemSenha);
        
        setEditando(false);
        setSenhaAtual('');
        setFormData({ ...formData, senha: '' });
        setMensagem({ tipo: 'sucesso', texto: 'Dados atualizados com sucesso!' });
        
        setTimeout(() => setMensagem({ tipo: '', texto: '' }), 3000);
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao salvar dados. Tente novamente.' });
    } finally {
      setCarregando(false);
    }
  };

  const handleCancelar = () => {
    setFormData({
      nome: usuario.nome || '',
      email: usuario.email || '',
      cep: usuario.cep || '',
      endereco: usuario.endereco || '',
      senha: ''
    });
    setSenhaAtual('');
    setEditando(false);
    setMensagem({ tipo: '', texto: '' });
  };

  useEffect(() => {
    const buscarEnderecoPorCEP = async () => {
      if (editando && formData.cep && formData.cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${formData.cep}/json/`);
          const dados = await response.json();
          
          if (!dados.erro) {
            const enderecoCompleto = `${dados.logradouro}, ${dados.bairro}, ${dados.localidade} - ${dados.uf}`;
            setFormData(prev => ({
              ...prev,
              endereco: enderecoCompleto
            }));
            setMensagem({ 
              tipo: 'sucesso', 
              texto: 'Endereço preenchido automaticamente!' 
            });
            setTimeout(() => setMensagem({ tipo: '', texto: '' }), 2000);
          }
        } catch (error) {
          console.error('Erro ao buscar CEP:', error);
        }
      }
    };
    
    buscarEnderecoPorCEP();
  }, [formData.cep, editando]);

  if (!usuario) {
    return (
      <Container>
        <Carregando>Carregando dados do usuário...</Carregando>
      </Container>
    );
  }

  return (
    <Container>
      <Cabecalho>
        <Titulo>
          <User />
          Seus Dados
        </Titulo>
        {!editando && (
          <BotaoEditar onClick={() => setEditando(true)}>
            <Edit2 />
            Editar dados
          </BotaoEditar>
        )}
      </Cabecalho>

      {mensagem.texto && (
        <Mensagem $tipo={mensagem.tipo as 'sucesso' | 'erro'}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle /> : <AlertCircle />}
          {mensagem.texto}
        </Mensagem>
      )}

      <Formulario>
        <Campo>
          <Label>Nome completo</Label>
          <Input
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            disabled={!editando}
            placeholder="Seu nome completo"
          />
        </Campo>

        <Campo>
          <Label>E-mail</Label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            disabled
            placeholder="seu@email.com"
          />
          <Dica>O e-mail não pode ser alterado</Dica>
        </Campo>

        <Campo>
          <Label>CEP</Label>
          <Input
            type="text"
            name="cep"
            value={formData.cep}
            onChange={handleInputChange}
            disabled={!editando}
            placeholder="00000000"
            maxLength={8}
          />
          <Dica>Digite 8 dígitos. O endereço será preenchido automaticamente.</Dica>
        </Campo>

        <Campo>
          <Label>Endereço</Label>
          <Input
            type="text"
            name="endereco"
            value={formData.endereco}
            onChange={handleInputChange}
            disabled={!editando}
            placeholder="Rua, número, bairro, cidade..."
          />
        </Campo>

        {editando && (
          <>
            <Campo>
              <Label>Nova senha (opcional)</Label>
              <Input
                type="password"
                name="senha"
                value={formData.senha}
                onChange={handleInputChange}
                placeholder="Deixe em branco para manter a senha atual"
              />
            </Campo>

            <Campo>
              <Label>
                Senha atual <Obrigatorio>*</Obrigatorio>
              </Label>
              <Input
                type="password"
                value={senhaAtual}
                onChange={(e) => setSenhaAtual(e.target.value)}
                placeholder="Digite sua senha atual para confirmar"
              />
              <Dica>Obrigatório para salvar as alterações</Dica>
            </Campo>
          </>
        )}

        {editando && (
          <Botoes>
            <Botao 
              $variant="salvar" 
              onClick={handleSalvar}
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <div className="spinner" style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }} />
                  Salvando...
                </>
              ) : (
                <>
                  <Save />
                  Salvar alterações
                </>
              )}
            </Botao>
            <Botao $variant="cancelar" onClick={handleCancelar}>
              <X />
              Cancelar
            </Botao>
          </Botoes>
        )}
      </Formulario>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </Container>
  );
};

export default SeusDados;