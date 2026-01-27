import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import styled from "styled-components";
import { useCarrinho } from "../../state/context/CarrinhoContext";
import { useFavoritos } from "../../state/context/FavoritosContext";
import categorias from "../../data/json/categorias.json";
import maisVendidos from "../../data/json/maisVendidos.json";
import { IProduto } from "../../interface/IProduto";
import estrela from "../../assets/Star 5.png";
import FreteCalculator from "../../components/FreteCalculator";

const PageContainer = styled.div`
  width: 100%;
  max-width: min(1200px, 95vw);
  margin: 0 auto;
  padding: 1.25rem 0.75rem;
  min-height: 60vh;

  @media (max-width: 768px) {
    padding: 1rem 0.5rem;
    max-width: 100%;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 0.25rem;
  }
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #6b7280;
  flex-wrap: wrap;

  a {
    color: #0d3b66;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: #0a2f52;
      text-decoration: underline;
    }
  }

  span {
    color: #9ca3af;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    gap: 0.25rem;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
    border-radius: 6px;
  }
`;

const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImageContainer = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  padding: 1rem;

  @media (max-width: 768px) {
    height: 320px;
    padding: 0.75rem;
  }

  @media (max-width: 480px) {
    height: 250px;
    padding: 0.5rem;
  }
`;

const MainImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const TitleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
`;

const ProductTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.3;
  margin: 0;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ShareButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  color: #4b5563;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;

  &:hover {
    background: #f3f4f6;
    border-color: #d1d5db;
  }

  i {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.85rem;
  }
`;

const RatingContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.375rem;

  img {
    width: 16px;
    height: 16px;
  }

  span {
    font-size: 0.9rem;
    color: #6b7280;
    font-weight: 500;
  }

  @media (max-width: 480px) {
    img {
      width: 14px;
      height: 14px;
    }
    
    span {
      font-size: 0.8rem;
    }
  }
`;

const FirstReview = styled.div`
  font-size: 0.9rem;
  color: #6b7280;
  margin-top: -0.5rem;
`;

const PriceSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
`;

const OldPriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const OldPrice = styled.div`
  font-size: 1rem;
  color: #9ca3af;
  text-decoration: line-through;
`;

const DiscountBadge = styled.span`
  background: #ef4444;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const CurrentPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
`;

const CurrentPrice = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #0d3b66;
`;

const PixBadge = styled.span`
  background: #10b981;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
`;

const InstallmentPrice = styled.div`
  font-size: 0.95rem;
  color: #4b5563;
  
  strong {
    color: #0d3b66;
  }
`;

const PixPrice = styled.div`
  font-size: 0.9rem;
  color: #059669;
  font-weight: 600;
  margin-top: 0.25rem;
`;

const FreteSection = styled.div`
  margin-top: 0.5rem;
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const QuantityLabel = styled.label`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  min-width: 100px;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const QuantityButton = styled.button`
  width: 36px;
  height: 36px;
  border: 2px solid #e5e7eb;
  background: white;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #0d3b66;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: #f3f4f6;
    border-color: #0d3b66;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const QuantityDisplay = styled.div`
  min-width: 50px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: #f9fafb;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;

  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: #0d3b66;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.875rem 1.5rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #0a2f52;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(13, 59, 102, 0.2);
  }

  &:active {
    transform: translateY(0);
  }

  i {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
`;

const FavoriteButton = styled.button<{ $isFavorito: boolean }>`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isFavorito ? '#fee2e2' : '#f3f4f6'};
  border: 2px solid ${props => props.$isFavorito ? '#ef4444' : '#e5e7eb'};
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  i {
    color: ${props => props.$isFavorito ? '#ef4444' : '#9ca3af'};
    font-size: 1.4rem;
  }

  &:hover {
    transform: scale(1.05);
    background: ${props => props.$isFavorito ? '#fecaca' : '#e5e7eb'};
  }

  @media (max-width: 480px) {
    width: 50px;
    height: 50px;
    
    i {
      font-size: 1.2rem;
    }
  }
`;

const Description = styled.div`
  color: #4b5563;
  line-height: 1.6;
  font-size: 0.95rem;
  padding: 1rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const InfoLabel = styled.span`
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  min-width: 80px;
`;

const InfoValue = styled.span`
  color: #4b5563;
  font-size: 0.9rem;
`;

const NotFound = styled.div`
  text-align: center;
  padding: 2rem 1rem;

  h2 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 0.75rem;
  }

  p {
    color: #6b7280;
    font-size: 0.95rem;
    margin-bottom: 1.5rem;
  }

  button {
    background: #0d3b66;
    color: white;
    border: none;
    padding: 0.625rem 1.25rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #0a2f52;
    }
  }
`;

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { adicionarAoCarrinho } = useCarrinho();
  const { isFavorito, toggleFavorito } = useFavoritos();

  const [produto, setProduto] = useState<IProduto | null>(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [id]);

  useEffect(() => {
    // Busca em TODAS as fontes de produtos
    const produtosCategorias = Object.values(categorias).flat();
    const todosProdutos = [...produtosCategorias, ...maisVendidos];

    // Remove duplicatas (caso o mesmo produto esteja em mais de um lugar)
    const produtosUnicos = todosProdutos.filter(
      (produto, index, self) => self.findIndex(p => p.id === produto.id) === index
    );

    const produtoEncontrado = produtosUnicos.find(p => p.id === Number(id));

    setProduto(produtoEncontrado || null);
  }, [id]);

  if (!produto) {
    return (
      <PageContainer>
        <NotFound>
          <h2>Produto não encontrado</h2>
          <p>Desculpe, o produto que você está procurando não existe.</p>
          <button onClick={() => navigate("/")}>
            Voltar para a página inicial
          </button>
        </NotFound>
      </PageContainer>
    );
  }

  const precoComDesconto = (produto.preco * 0.95).toFixed(2);
  const economia = (produto.preco - parseFloat(precoComDesconto)).toFixed(2);
  const emEstoque = (produto.quantidade || 0) > 0;
  const produtoFavorito = isFavorito(produto.id);
  const descontoPercentual = 26; 

  const handleAddToCart = () => {
    for (let i = 0; i < quantidade; i++) {
      adicionarAoCarrinho(produto);
    }
  };

  const incrementarQuantidade = () => {
    if (quantidade < (produto.quantidade || 0)) {
      setQuantidade(quantidade + 1);
    }
  };

  const decrementarQuantidade = () => {
    if (quantidade > 1) {
      setQuantidade(quantidade - 1);
    }
  };

  const handleToggleFavorito = () => {
    toggleFavorito(produto);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: produto.nome,
        text: `Confira ${produto.nome} na nossa loja!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copiado para a área de transferência!");
    }
  };

  const formatarNomeCategoria = (categoria: string) => {
    const mapeamento: Record<string, string> = {
      'eletronicos': 'Eletrônicos',
      'informatica': 'Informática',
      'cozinha': 'Cozinha',
      'audio-e-video': 'Áudio e Vídeo',
      'games': 'Games',
      'eletrodomesticos': 'Eletrodomésticos'
    };
    return mapeamento[categoria] || categoria.charAt(0).toUpperCase() + categoria.slice(1);
  };

  // Busca a categoria do produto 
  const categoriaNome = Object.keys(categorias).find(key =>
    categorias[key as keyof typeof categorias].some(p => p.id === produto.id)
  );

  return (
    <PageContainer>
      <Breadcrumb>
        <Link to="/">Início</Link>
        <span>/</span>
        {categoriaNome && (
          <>
            <Link to={`/categorias/${categoriaNome}`}>
              {formatarNomeCategoria(categoriaNome)}
            </Link>
            <span>/</span>
          </>
        )}
        <span>{produto.nome}</span>
      </Breadcrumb>

      <ProductContainer>
        <ImageSection>
          <MainImageContainer>
            <MainImage src={produto.imagem} alt={produto.nome} />
          </MainImageContainer>
        </ImageSection>

        <InfoSection>
          <TitleRow>
            <ProductTitle>{produto.nome}</ProductTitle>
            <ShareButton onClick={handleShare}>
              <i className="bi bi-share"></i>
              Compartilhar
            </ShareButton>
          </TitleRow>

          <RatingContainer>
            {[...Array(5)].map((_, index) => (
              <img key={index} src={estrela} alt="Estrela" />
            ))}
            <span>({(produto.avaliacao || 4.5).toFixed(1)})</span>
          </RatingContainer>

          <FirstReview>
            seja o primeiro a avaliar
          </FirstReview>

          <Description>
            {produto.descricao || 'Produto de alta qualidade com garantia do fabricante.'}
            <br />
            <br />
            <strong>mais informações</strong>
          </Description>
          <PriceSection>
            <OldPriceRow>
              <OldPrice>R$ {produto.preco.toFixed(2).replace('.', ',')}</OldPrice>
              <DiscountBadge>{descontoPercentual}%</DiscountBadge>
            </OldPriceRow>
            
            <CurrentPriceRow>
              <CurrentPrice>R$ {precoComDesconto.replace('.', ',')}</CurrentPrice>
              <PixBadge>no Pix</PixBadge>
            </CurrentPriceRow>

            <PixPrice>
              - R$ {parseFloat(precoComDesconto).toFixed(2).replace('.', ',')} em até 7x de R$ {(parseFloat(precoComDesconto)/7).toFixed(2).replace('.', ',')}
            </PixPrice>

            <InstallmentPrice>
              <strong>R$ {parseFloat(precoComDesconto).toFixed(2).replace('.', ',')}</strong> em até 7x de <strong>R$ {(parseFloat(precoComDesconto)/7).toFixed(2).replace('.', ',')}</strong> exclusiva no cartão cliente. Aproveite e peça o seu
            </InstallmentPrice>
          </PriceSection>

          <FreteSection>
            <FreteCalculator />
          </FreteSection>

          <ActionSection>
            <QuantityRow>
              <QuantityLabel>quantidade:</QuantityLabel>
              <QuantityControls>
                <QuantityButton
                  onClick={decrementarQuantidade}
                  disabled={quantidade <= 1}
                >
                  -
                </QuantityButton>
                <QuantityDisplay>{quantidade} unidade{quantidade > 1 ? 's' : ''}</QuantityDisplay>
                <QuantityButton
                  onClick={incrementarQuantidade}
                  disabled={quantidade >= (produto.quantidade || 0)}
                >
                  +
                </QuantityButton>
              </QuantityControls>
            </QuantityRow>

            <ActionButtons>
              <AddToCartButton onClick={handleAddToCart}>
                <i className="bi bi-cart-plus"></i>
                comprar
              </AddToCartButton>
              <FavoriteButton
                $isFavorito={produtoFavorito}
                onClick={handleToggleFavorito}
                title={produtoFavorito ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                <i className={produtoFavorito ? "bi bi-heart-fill" : "bi bi-heart"}></i>
              </FavoriteButton>
            </ActionButtons>
          </ActionSection>
        </InfoSection>
      </ProductContainer>
    </PageContainer>
  );
};

export default ProductDetails;