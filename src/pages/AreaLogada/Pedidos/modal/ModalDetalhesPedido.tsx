import React from 'react';
import { X, Truck, CreditCard, Calendar, MapPin, User, Mail, Package, Check } from 'lucide-react';
import styled from 'styled-components';

interface Produto {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
}

interface Pedido {
  id: number;
  data: string;
  produtos: Produto[];
  total: number;
}

interface Usuario {
  nome: string;
  email: string;
  cep?: string;
  endereco?: string;
}

interface ModalDetalhesPedidoProps {
  pedido: Pedido | null;
  usuario: Usuario | null;
  onClose: () => void;
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  animation: slideIn 0.3s ease;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);

  @media (max-width: 768px) {
    border-radius: 12px;
    max-height: 95vh;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  border-radius: 16px 16px 0 0;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #0A2647;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  word-wrap: break-word;

  @media (max-width: 1024px) {
    font-size: 1.375rem;
  }

  @media (max-width: 768px) {
    font-size: 1.25rem;
    gap: 0.375rem;
  }

  @media (max-width: 480px) {
    font-size: 1.125rem;
    width: 100%;
  }

  svg {
    width: 24px;
    height: 24px;

    @media (max-width: 768px) {
      width: 22px;
      height: 22px;
    }

    @media (max-width: 480px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #64748b;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  @media (max-width: 480px) {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  &:hover {
    background: #f1f5f9;
    color: #0A2647;
  }

  svg {
    width: 24px;
    height: 24px;

    @media (max-width: 768px) {
      width: 22px;
      height: 22px;
    }

    @media (max-width: 480px) {
      width: 20px;
      height: 20px;
    }
  }
`;

const ModalBody = styled.div`
  padding: 1.5rem;

  @media (max-width: 768px) {
    padding: 1.25rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
`;

const InfoCard = styled.div`
  background: #f8fafc;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.875rem;
  }
`;

const InfoHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  @media (max-width: 480px) {
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
`;

const InfoIcon = styled.div`
  color: #0A2647;
  display: flex;
  align-items: center;

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

const InfoTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
  }
`;

const InfoValue = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #0A2647;
  margin: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
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

const SectionTitle = styled.h4`
  font-size: 1.125rem;
  font-weight: 600;
  color: #334155;
  margin-bottom: 1rem;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9375rem;
    margin-bottom: 0.75rem;
  }
`;

const ListaProdutos = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;
  background: #f8fafc;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
    border-radius: 4px;
  }
`;

const ItemProduto = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1rem;
  border-bottom: 1px solid #e2e8f0;
  background: white;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    flex-direction: column;
    gap: 0.25rem;
  }

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const NomeProduto = styled.span`
  color: #475569;
  font-weight: 500;
  flex: 1;
  min-width: 0;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    width: 100%;
  }
`;

const PrecoProduto = styled.span`
  color: #0A2647;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 0.9375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    width: 100%;
    text-align: right;
  }
`;

const ContainerTotal = styled.div`
  background: #f1f5f9;
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1.5rem;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 1.25rem;
    margin-top: 1.25rem;
    border-radius: 6px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 4px;
  }
`;

const LabelTotal = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 0.5rem 0;
  font-weight: 500;
  word-wrap: break-word;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
    margin-bottom: 0.375rem;
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

const ModalDetalhesPedido: React.FC<ModalDetalhesPedidoProps> = ({ pedido, usuario, onClose }) => {
  if (!pedido) return null;

  const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <Package />
            Detalhes do Pedido #{pedido.id}
          </ModalTitle>
          <CloseButton onClick={onClose}>
            <X />
          </CloseButton>
        </ModalHeader>
        
        <ModalBody>
          <InfoGrid>
            <InfoCard>
              <InfoHeader>
                <InfoIcon>
                  <Calendar size={18} />
                </InfoIcon>
                <InfoTitle>Data do Pedido</InfoTitle>
              </InfoHeader>
              <InfoValue>
                {new Date(pedido.data).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoHeader>
                <InfoIcon>
                  <Truck size={18} />
                </InfoIcon>
                <InfoTitle>Status</InfoTitle>
              </InfoHeader>
              <InfoValue>
                <StatusBadge>
                  <Check size={16} />
                  Entregue
                </StatusBadge>
              </InfoValue>
            </InfoCard>

            <InfoCard>
              <InfoHeader>
                <InfoIcon>
                  <CreditCard size={18} />
                </InfoIcon>
                <InfoTitle>Método de Pagamento</InfoTitle>
              </InfoHeader>
              <InfoValue>Cartão de Crédito</InfoValue>
            </InfoCard>

            {usuario && (
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <User size={18} />
                  </InfoIcon>
                  <InfoTitle>Cliente</InfoTitle>
                </InfoHeader>
                <InfoValue>{usuario.nome}</InfoValue>
                {usuario.email && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <Mail size={14} />
                    <span style={{ fontSize: '0.875rem', color: '#64748b' }}>{usuario.email}</span>
                  </div>
                )}
              </InfoCard>
            )}

            {usuario?.endereco && (
              <InfoCard>
                <InfoHeader>
                  <InfoIcon>
                    <MapPin size={18} />
                  </InfoIcon>
                  <InfoTitle>Endereço de Entrega</InfoTitle>
                </InfoHeader>
                <InfoValue style={{ fontSize: '0.9375rem', lineHeight: '1.4' }}>{usuario.endereco}</InfoValue>
                {usuario.cep && (
                  <span style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>
                    CEP: {usuario.cep}
                  </span>
                )}
              </InfoCard>
            )}
          </InfoGrid>

          <SectionTitle>Itens do Pedido</SectionTitle>
          
          <ListaProdutos>
            {pedido.produtos.map((produto) => (
              <ItemProduto key={produto.id}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <NomeProduto>{produto.nome}</NomeProduto>
                  <div style={{ fontSize: '0.875rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Quantidade: {produto.quantidade} × {formatador.format(produto.preco)}
                  </div>
                </div>
                <PrecoProduto>
                  {formatador.format(produto.preco * produto.quantidade)}
                </PrecoProduto>
              </ItemProduto>
            ))}
          </ListaProdutos>

          <ContainerTotal>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <LabelTotal>Subtotal dos produtos</LabelTotal>
              <span style={{ fontWeight: '500', color: '#0A2647' }}>{formatador.format(pedido.total)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <LabelTotal>Frete</LabelTotal>
              <span style={{ fontWeight: '500', color: '#0A2647' }}>{formatador.format(0)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #cbd5e1', flexWrap: 'wrap', gap: '0.5rem' }}>
              <LabelTotal style={{ fontSize: '1rem', fontWeight: '600', color: '#0A2647' }}>Total do pedido</LabelTotal>
              <ValorTotal>{formatador.format(pedido.total)}</ValorTotal>
            </div>
          </ContainerTotal>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ModalDetalhesPedido;