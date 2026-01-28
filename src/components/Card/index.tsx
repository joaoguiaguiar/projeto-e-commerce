import { useNavigate } from "react-router-dom";
import { IProduto } from "../../interface/IProduto";
import { useCarrinho } from "../../state/context/CarrinhoContext";
import { useFavoritos } from "../../state/context/FavoritosContext";
import { calcularDesconto, formatarPreco } from "../../utils/descontoUtils";
import estrela from "../../assets/Star 5.png";
import './Card.scss';

interface CardProps {
  produtos?: IProduto[];  
  visualizacao?: 'grid' | 'lista';
  produtosPorCategoria?: {
    [key: string]: IProduto[];
  };
}

const Card = ({ produtos, produtosPorCategoria, visualizacao = 'grid' }: CardProps) => {
  const produtosParaExibir = produtos || 
    (produtosPorCategoria ? Object.values(produtosPorCategoria).flat() : []);
  
  const navigate = useNavigate();
  const { adicionarAoCarrinho } = useCarrinho();
  const { isFavorito, toggleFavorito } = useFavoritos();

  const handleCardClick = (produto: IProduto) => {
    navigate(`/produto/${produto.id}`);
  };

  const handleComprarClick = (e: React.MouseEvent, produto: IProduto) => {
    e.stopPropagation();
    // ✅ Envia o produto com preço ORIGINAL - o desconto será aplicado no CarrinhoContext
    adicionarAoCarrinho(produto);
  };

  const handleFavoritoClick = (e: React.MouseEvent, produto: IProduto) => {
    e.stopPropagation();
    toggleFavorito(produto);
  };

  // Verifica se há produtos para exibir
  if (produtosParaExibir.length === 0) {
    return (
      <div className="sem-produtos">
        Nenhum produto disponível
      </div>
    );
  }

  return (
    <div className={`card-wrapper ${visualizacao}`}>
      {produtosParaExibir.map((produto) => {
        // ✅ USA as funções utilitárias para calcular o desconto
        const { precoComDesconto, economia } = calcularDesconto(produto.preco);
        const produtoFavorito = isFavorito(produto.id);

        return (
          <div
            key={produto.id}
            className={`card-container ${visualizacao}`}
            onClick={() => handleCardClick(produto)}
          >
            <button
              className={`favorito-btn ${produtoFavorito ? 'favoritado' : ''}`}
              onClick={(e) => handleFavoritoClick(e, produto)}
              title={produtoFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            >
              <i className={produtoFavorito ? "bi bi-heart-fill" : "bi bi-heart"}></i>
            </button>

            <div className={`imagem-container ${visualizacao}`}>
              <img
                src={produto.imagem}
                alt={`Imagem de ${produto.nome}`}
                className={`imagem-produto ${visualizacao}`}
              />
            </div>

            <div className={`info-container ${visualizacao}`}>
              <h3 className={`nome-produto ${visualizacao}`}>{produto.nome}</h3>
              
              <p className={`descricao ${visualizacao}`}>
                {produto.descricao || 'Produto de alta qualidade com garantia do fabricante.'}
              </p>
              
              <div className="avaliacao">
                {[...Array(5)].map((_, index) => (
                  <img key={index} src={estrela} alt="Estrela de avaliação" />
                ))}
                <span>({(produto.avaliacao || 4.5).toFixed(1)})</span>
              </div>

              <div className={`preco-container ${visualizacao}`}>
                <span className="texto-a-partir">A partir de:</span>
                <div className={`preco-original ${visualizacao}`}>
                  R$ {formatarPreco(produto.preco)}
                </div>
                <div className={`preco-desconto ${visualizacao}`}>
                  R$ {formatarPreco(precoComDesconto)}
                </div>
                <span className={`economia ${visualizacao}`}>
                  Economize R$ {formatarPreco(economia)}
                </span>
              </div>

              <div className={`botoes-container ${visualizacao}`}>
                <button
                  className={`botao-comprar ${visualizacao}`}
                  onClick={(e) => handleComprarClick(e, produto)}
                >
                  <i className="bi bi-cart-plus"></i>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;