import Offcanvas from "react-bootstrap/Offcanvas";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
import lixeira from './assets/lixeira.png';
import { useCarrinho } from "../../state/context/CarrinhoContext";
import './ModalCarrinho.scss';
import { useRecoilValue } from "recoil";
import { cepAtom } from "../../state/authState";
import { useNavigate } from "react-router-dom";

interface ModalCarrinhoProps {
  aberta: boolean;
  aoFechar: () => void;
}

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 1rem;
`;

const ContainerP = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ContainerBotao = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
`;

const ModalCarrinho = ({ aberta, aoFechar }: ModalCarrinhoProps) => {
  
  const { itensCarrinho, atualizarQuantidade, removerDoCarrinho, gerarPedido } = useCarrinho();
  
  const cep = useRecoilValue(cepAtom);

  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!cep) {
      alert("Por favor, cadastre seu CEP antes de continuar.");
      return;
    }

    const cepUsuario = cep;  
    if (cep !== cepUsuario) {
      alert("O CEP informado não corresponde ao CEP cadastrado.");
      return;
    }

    gerarPedido({ cep }); 
    aoFechar();
    navigate('/minha-conta/pedidos'); 
  };

  const total = itensCarrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );

  return (
    <Offcanvas show={aberta} onHide={aoFechar} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Carrinho</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="ModalCarrinhoBody">
        <div className="ModalCarrinhoContent">
          {itensCarrinho.length > 0 ? (
            <>
              {itensCarrinho.map((item) => (
                <ItemContainer key={item.id}>
                  <div>
                    <img src={item.imagem} alt={item.nome} style={{ width: 50 }} />
                    <p>{item.nome}</p>
                    <strong>R$ {item.preco.toFixed(2)}</strong>
                  </div>
                  <div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                    >
                      +
                    </Button>
                    <span style={{ margin: "0 8px" }}>{item.quantidade}</span>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                    >
                      -
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removerDoCarrinho(item.id)}
                      className="lixeira"
                    >
                      <img src={lixeira} alt="Remover" style={{ width: 16, marginLeft: 2 }} />
                    </Button>
                  </div>
                </ItemContainer>
              ))}
            </>
          ) : (
            <p>O carrinho está vazio.</p>
          )}
        </div>

        {itensCarrinho.length > 0 && (
          <div className="TotalContainer">
            <ContainerP>
              <strong>Subtotal:</strong>
              <p>R$ {total.toFixed(2)}</p>
            </ContainerP>
            <ContainerBotao>
              <button className="btnCarrinho" onClick={handleCheckout}>
                Ir para o checkout
              </button>
            </ContainerBotao>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default ModalCarrinho;
