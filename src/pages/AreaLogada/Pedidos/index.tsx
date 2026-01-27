import { useState, useEffect } from 'react';
import { Package, Trash2, Eye, Check } from 'lucide-react';
import styled from 'styled-components';
import '../AreaLogada.scss';
import ModalDetalhesPedido from './modal/ModalDetalhesPedido';

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
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #f1f5f9;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1.25rem;
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

const ListaPedidos = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const CardPedido = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s ease;
  background: white;

  @media (max-width: 768px) {
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    border-radius: 6px;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: #cbd5e1;
    
    @media (max-width: 768px) {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    }
  }
`;

const CabecalhoPedido = styled.div`
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.25rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 1024px) {
    padding: 1rem;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    gap: 0.5rem;
  }
`;

const InfoPedido = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

const NumeroPedido = styled.p`
  font-weight: 700;
  color: #0A2647;
  font-size: 1.1rem;
  margin: 0;
  word-wrap: break-word;

  @media (max-width: 1024px) {
    font-size: 1.05rem;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const DataPedido = styled.p`
  color: #64748b;
  font-size: 0.875rem;
  margin: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const StatusBadge = styled.span`
  background: linear-gradient(135deg, #059669 0%, #10b981 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    padding: 0.375rem 0.75rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.3125rem 0.625rem;
    gap: 0.25rem;
  }

  svg {
    width: 16px;
    height: 16px;

    @media (max-width: 768px) {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 480px) {
      width: 12px;
      height: 12px;
    }
  }
`;

const CorpoPedido = styled.div`
  padding: 1.25rem;

  @media (max-width: 1024px) {
    padding: 1rem;
  }

  @media (max-width: 768px) {
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

const TituloProdutos = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 1rem 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    margin-bottom: 0.75rem;
  }
`;

const ListaProdutos = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const ItemProduto = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  background: #f8fafc;
  transition: background 0.2s ease;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.625rem;
    margin-bottom: 0.375rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    margin-bottom: 0.25rem;
    border-radius: 4px;
  }

  &:hover {
    background: #f1f5f9;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const NomeProduto = styled.span`
  color: #475569;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const PrecoProduto = styled.span`
  color: #0A2647;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8125rem;
  }
`;

const RodapePedido = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
    padding-top: 0.875rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding-top: 0.75rem;
  }
`;

const ContainerTotal = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    text-align: center;
  }
`;

const LabelTotal = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
  font-weight: 500;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const ValorTotal = styled.p`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0A2647;
  margin: 0;
  word-wrap: break-word;

  @media (max-width: 1024px) {
    font-size: 1.375rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const Acoes = styled.div`
  display: flex;
  gap: 0.75rem;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: center;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const Botao = styled.button<{ $variant?: 'primary' | 'danger' }>`
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
  white-space: nowrap;
  min-width: 120px;

  @media (max-width: 1024px) {
    padding: 0.5625rem 1rem;
    min-width: 110px;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.875rem;
    font-size: 0.8125rem;
    min-width: 100px;
    flex: 1;
  }

  @media (max-width: 480px) {
    padding: 0.625rem;
    font-size: 0.75rem;
    min-width: 0;
    width: 100%;
  }

  &:hover {
    transform: translateY(-2px);
  }

  ${props => props.$variant === 'danger' ? `
    background: #fef2f2;
    color: #dc2626;
    border: 1px solid #fecaca;

    &:hover {
      background: #fee2e2;
      box-shadow: 0 4px 8px rgba(220, 38, 38, 0.2);
    }
  ` : `
    background: #0A2647;
    color: white;

    &:hover {
      background: #144272;
      box-shadow: 0 4px 8px rgba(10, 38, 71, 0.3);
    }
  `}

  svg {
    width: 16px;
    height: 16px;

    @media (max-width: 768px) {
      width: 14px;
      height: 14px;
    }

    @media (max-width: 480px) {
      width: 12px;
      height: 12px;
    }
  }
`;

const VazioContainer = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: #f8fafc;
  border-radius: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 1024px) {
    padding: 3rem 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 2.5rem 1rem;
    border-radius: 8px;
  }

  @media (max-width: 480px) {
    padding: 2rem 0.75rem;
    border-radius: 6px;
  }
`;

const IconeVazio = styled.div`
  display: inline-flex;
  padding: 1.5rem;
  background: white;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  svg {
    width: 48px;
    height: 48px;
    color: #94a3b8;

    @media (max-width: 768px) {
      width: 40px;
      height: 40px;
    }

    @media (max-width: 480px) {
      width: 36px;
      height: 36px;
    }
  }
`;

const TituloVazio = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #334155;
  margin: 0 0 0.5rem 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1.25rem;
    margin-bottom: 0.375rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
  }
`;

const TextoVazio = styled.p`
  color: #64748b;
  font-size: 1rem;
  margin: 0;
  max-width: 500px;
  margin: 0 auto;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    max-width: 300px;
  }
`;

const Pedidos = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<any>(null);
  const [usuario, setUsuario] = useState<any>(null);
  const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

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

  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    setPedidos(pedidosSalvos.map((pedido: any) => ({
      ...pedido,
      total: pedido.produtos.reduce(
        (acc: number, item: any) => acc + item.preco * item.quantidade,
        0
      ),
    })));
    
    const user = getUserFromStorage();
    setUsuario(user);
  }, []);

  const excluirPedido = (pedidoId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este pedido?')) {
      const novosPedidos = pedidos.filter(p => p.id !== pedidoId);
      setPedidos(novosPedidos);
      localStorage.setItem('pedidos', JSON.stringify(novosPedidos));
    }
  };

  if (pedidos.length === 0) {
    return (
      <Container>
        <VazioContainer>
          <IconeVazio>
            <Package />
          </IconeVazio>
          <TituloVazio>Nenhum pedido encontrado</TituloVazio>
          <TextoVazio>Você ainda não realizou nenhuma compra.</TextoVazio>
        </VazioContainer>
      </Container>
    );
  }

  return (
    <>
      <Container>
        <Cabecalho>
          <Titulo>
            <Package />
            Meus Pedidos
          </Titulo>
        </Cabecalho>
        
        <ListaPedidos>
          {pedidos.map((pedido) => (
            <CardPedido key={pedido.id}>
              <CabecalhoPedido>
                <InfoPedido>
                  <NumeroPedido>Pedido #{pedido.id}</NumeroPedido>
                  <DataPedido>
                    Realizado em {new Date(pedido.data).toLocaleDateString('pt-BR')}
                  </DataPedido>
                </InfoPedido>
                <StatusBadge>
                  <Check size={16} />
                  Entregue
                </StatusBadge>
              </CabecalhoPedido>

              <CorpoPedido>
                <TituloProdutos>Produtos:</TituloProdutos>
                <ListaProdutos>
                  {pedido.produtos.map((produto: any) => (
                    <ItemProduto key={produto.id}>
                      <NomeProduto>
                        {produto.nome} × {produto.quantidade}
                      </NomeProduto>
                      <PrecoProduto>
                        {formatador.format(produto.preco * produto.quantidade)}
                      </PrecoProduto>
                    </ItemProduto>
                  ))}
                </ListaProdutos>

                <RodapePedido>
                  <ContainerTotal>
                    <LabelTotal>Valor total</LabelTotal>
                    <ValorTotal>
                      {formatador.format(pedido.total)}
                    </ValorTotal>
                  </ContainerTotal>
                  
                  <Acoes>
                    <Botao 
                      $variant="primary"
                      onClick={() => setPedidoSelecionado(pedido)}
                    >
                      <Eye />
                      Ver detalhes
                    </Botao>
                    <Botao 
                      $variant="danger"
                      onClick={() => excluirPedido(pedido.id)}
                    >
                      <Trash2 />
                      Excluir
                    </Botao>
                  </Acoes>
                </RodapePedido>
              </CorpoPedido>
            </CardPedido>
          ))}
        </ListaPedidos>
      </Container>

      {pedidoSelecionado && (
        <ModalDetalhesPedido
          pedido={pedidoSelecionado}
          usuario={usuario}
          onClose={() => setPedidoSelecionado(null)}
        />
      )}
    </>
  );
};

export default Pedidos;