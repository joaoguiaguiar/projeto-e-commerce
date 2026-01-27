import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFavoritos } from '../../state/context/FavoritosContext';
import Card from '../../components/Card';
import { Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const ContainerPagina = styled.div`
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 0;
`;

const Cabecalho = styled.div`
  margin-bottom: 2rem;
`;

const Titulo = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  i {
    color: #ef4444;
  }
`;

const Subtitulo = styled.p`
  font-size: 1rem;
  color: #6b7280;
`;

const Controles = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const TextoInformacao = styled.div`
  font-size: 0.95rem;
  color: #6b7280;
  
  strong {
    color: #1f2937;
    font-weight: 600;
  }
`;

const AlternarVisao = styled.div`
  display: flex;
  gap: 0.5rem;
  background: white;
  padding: 0.25rem;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const BotaoVisao = styled.button<{ $ativo: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  background: ${props => props.$ativo ? '#0d3b66' : 'transparent'};
  color: ${props => props.$ativo ? 'white' : '#6b7280'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: ${props => props.$ativo ? '#0a2f52' : '#f3f4f6'};
  }
`;

const EstadoVazio = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  text-align: center;
  
  i {
    font-size: 5rem;
    color: #e5e7eb;
    margin-bottom: 1.5rem;
  }
  
  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }
  
  p {
    font-size: 1rem;
    color: #6b7280;
    margin-bottom: 2rem;
    max-width: 400px;
  }
`;

const BotaoContinuar = styled.button`
  padding: 0.75rem 2rem;
  background: #0d3b66;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  line-height: 2rem;
  
  .bi-shop {
    font-size: 2rem;
    vertical-align: middle;
    margin-right: 0.75rem;
  }
  
  &:hover {
    background: #0a2f52;
    transform: translateY(-2px);
  }
`;

const BotaoLimpar = styled.button`
  padding: 0.5rem 1rem;
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: #fef2f2;
  }
`;

const ContainerCartoes = styled.div`
  width: 100%;
  
  & > div {
    justify-content: flex-start !important;
    flex-wrap: wrap;
    overflow: none;
  }
`;

const Favoritos = () => {
  const { favoritos, removerFavorito } = useFavoritos();
  const [visualizacao, setVisualizacao] = useState<'grid' | 'lista'>('grid');
  const navigate = useNavigate();

  // Rolagem para o topo quando a página carrega
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []); // Array vazio - executa apenas na montagem

  const limparFavoritos = () => {
    if (window.confirm('Deseja realmente remover todos os favoritos?')) {
      favoritos.forEach(produto => removerFavorito(produto.id));
    }
  };

  const irParaHome = () => {
    navigate('/');
  };

  return (
    <ContainerPagina>
      <Container>
        <Cabecalho>
          <Titulo>
            <i className="bi bi-heart-fill"></i>
            Meus Favoritos
          </Titulo>
          <Subtitulo>
            Produtos que você salvou para comprar depois
          </Subtitulo>
        </Cabecalho>

        {favoritos.length > 0 ? (
          <>
            <Controles>
              <TextoInformacao>
                <strong>{favoritos.length}</strong> {favoritos.length === 1 ? 'produto' : 'produtos'} salvos
              </TextoInformacao>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <BotaoLimpar onClick={limparFavoritos}>
                  <i className="bi bi-trash"></i>
                  Limpar favoritos
                </BotaoLimpar>

                <AlternarVisao>
                  <BotaoVisao
                    $ativo={visualizacao === 'grid'}
                    onClick={() => setVisualizacao('grid')}
                  >
                    <i className="bi bi-grid-3x3"></i>
                    Grade
                  </BotaoVisao>
                  <BotaoVisao
                    $ativo={visualizacao === 'lista'}
                    onClick={() => setVisualizacao('lista')}
                  >
                    <i className="bi bi-list-ul"></i>
                    Lista
                  </BotaoVisao>
                </AlternarVisao>
              </div>
            </Controles>

            <ContainerCartoes>
              <Card produtos={favoritos} visualizacao={visualizacao} />
            </ContainerCartoes>
          </>
        ) : (
          <EstadoVazio>
            <i className="bi bi-heart"></i>
            <h3>Nenhum favorito ainda</h3>
            <p>
              Explore nossos produtos e clique no coração para salvar seus itens preferidos aqui!
            </p>
            <BotaoContinuar onClick={irParaHome}>
              <i className="bi bi-shop"></i>
              Começar a comprar
            </BotaoContinuar>
          </EstadoVazio>
        )}
      </Container>
    </ContainerPagina>
  );
};

export default Favoritos;