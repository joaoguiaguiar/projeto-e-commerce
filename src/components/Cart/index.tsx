import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { useCarrinho } from '../../state/context/CarrinhoContext';
import { useAuth } from '../../state/hook/useAuth ';
import { useNavigate } from 'react-router-dom';
import './Cart.scss'

interface CarrinhoOffcanvasProps {
    mostrar: boolean;
    onFechar: () => void;
}

const CarrinhoOffcanvas: FC<CarrinhoOffcanvasProps> = ({ mostrar, onFechar }) => {
    const { itensCarrinho, atualizarQuantidade, removerDoCarrinho, gerarPedido } = useCarrinho();
    const { auth } = useAuth();
    const navigate = useNavigate();

    const usuarioLogado = auth.user;
    const totalItensCarrinho = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);
    const totalCarrinho = itensCarrinho.reduce(
        (acc, item) => acc + item.preco * item.quantidade,
        0
    );

    const handleCheckout = () => {
        if (!usuarioLogado) {
            alert("Ops! Você precisa estar logado para finalizar sua compra.");
            onFechar();
            navigate('/login');
            return;
        }

        const cepUsuario = usuarioLogado.cep || '';
        
        if (!cepUsuario) {
            alert("Por favor, cadastre seu CEP em 'Meus Dados' antes de finalizar a compra.");
            onFechar();
            navigate('/minha-conta/dados');
            return;
        }

        gerarPedido({ cep: cepUsuario.toString()});
        
        onFechar();
        
        navigate('/minha-conta/pedidos');
    };

    const handleContinuarComprando = () => {
        onFechar();
    };

    return (
        <Offcanvas
            show={mostrar}
            onHide={onFechar}
            placement="end"
            className="offcanvas-carrinho"
        >
            <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title>
                    <h3 className="titulo-carrinho">
                        <i className="bi bi-cart me-2"></i>
                        Seu Carrinho ({totalItensCarrinho})
                    </h3>
                </Offcanvas.Title>
            </Offcanvas.Header>
            
            <Offcanvas.Body>
                <div className="conteudo-carrinho">
                    {itensCarrinho.length > 0 ? (
                        <>
                            <div className="lista-itens-carrinho">
                                {itensCarrinho.map((item) => {
                                    const estoqueDisponivel = item.estoqueDisponivel || null;
                                    const atingeLimite = estoqueDisponivel !== null && 
                                                        item.quantidade >= estoqueDisponivel;

                                    return (
                                        <div key={item.id} className="item-carrinho">
                                            <div className="info-item">
                                                <img
                                                    src={item.imagem}
                                                    alt={item.nome}
                                                    className="imagem-item"
                                                />
                                                <div className="detalhes-item">
                                                    <h6 className="nome-item">{item.nome}</h6>
                                                    <p className="preco-item">
                                                        R$ {item.preco.toFixed(2).replace('.', ',')}
                                                    </p>
                                                    {atingeLimite && (
                                                        <small className="text-warning fw-bold">
                                                            <i className="bi bi-exclamation-triangle me-1"></i>
                                                            Limite: {estoqueDisponivel} unidades
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="controles-item">
                                                <div className="quantidade-controle">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => atualizarQuantidade(item.id, item.quantidade - 1)}
                                                        disabled={item.quantidade <= 1}
                                                    >
                                                        <i className="bi bi-dash"></i>
                                                    </Button>
                                                    <span className="quantidade-valor">{item.quantidade}</span>
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (!atingeLimite) {
                                                                atualizarQuantidade(item.id, item.quantidade + 1);
                                                            }
                                                        }}
                                                        disabled={atingeLimite}
                                                    >
                                                        <i className="bi bi-plus"></i>
                                                    </Button>
                                                </div>

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removerDoCarrinho(item.id)}
                                                    className="botao-remover"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="resumo-carrinho">
                                <div className="total-container">
                                    <span className="total-label">Total:</span>
                                    <span className="total-valor">R$ {totalCarrinho.toFixed(2).replace('.', ',')}</span>
                                </div>

                                <Button
                                    variant="dark"
                                    className="botao-finalizar w-100 mt-3"
                                    onClick={handleCheckout}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    {usuarioLogado ? 'Finalizar Pedido' : 'Fazer Login para Comprar'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="carrinho-vazio">
                            <i className="bi bi-cart-x icone-carrinho-vazio"></i>
                            <p className="texto-carrinho-vazio">Seu carrinho está vazio</p>
                            <Button
                                variant="dark"
                                className="botao-continuar-comprando"
                                onClick={handleContinuarComprando}
                            >
                                Continuar Comprando
                            </Button>
                        </div>
                    )}
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default CarrinhoOffcanvas;