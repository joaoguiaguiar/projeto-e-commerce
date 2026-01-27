// src/components/Search/SearchDropdown.tsx
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../../state/context/SearchContext';
import { IProduto } from '../../../interface/IProduto';

const SearchDropdown = () => {
  const navigate = useNavigate();
  const {
    termoBusca,
    setTermoBusca,
    setDropdownAberto,
    produtosFiltrados,
    categoriasSugeridas
  } = useSearch();

  const handleCategoriaClick = (path: string) => {
    navigate(path);
    setDropdownAberto(false);
    setTermoBusca(''); // Limpa o input
  };

  const handleProdutoClick = (produto: IProduto) => {
    navigate(`/produto/${produto.id}`);
    setDropdownAberto(false);
    setTermoBusca(''); // Limpa o input
  };

  // ============================================
  // MODO 1: SEM BUSCA (categorias populares)
  // ============================================
  if (!termoBusca.trim()) {
    return (
      <div className="search-dropdown">
        <div className="search-dropdown-header">
          <i className="bi bi-fire me-2"></i>
          <span>Categorias Populares</span>
        </div>
        
        <div className="search-categories-only">
          {categoriasSugeridas.slice(0, 6).map((categoria, index) => {
            const categoriaUrl = categoria.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/\s+/g, '-');
            
            return (
              <button
                key={index}
                className="search-category-item"
                onClick={() => handleCategoriaClick(`/categorias/${categoriaUrl}`)}
              >
                <i className="bi bi-tag-fill"></i>
                <span>{categoria}</span>
                <i className="bi bi-arrow-right-short arrow-icon"></i>
              </button>
            );
          })}
        </div>

        <div className="search-dropdown-footer">
          <i className="bi bi-lightbulb me-2"></i>
          <span>Digite para começar sua busca</span>
        </div>
      </div>
    );
  }

  // ============================================
  // MODO 2: COM BUSCA (APENAS PRODUTOS)
  // ============================================
  const mostrarProdutos = produtosFiltrados.length > 0;
  const produtosParaMostrar = produtosFiltrados.slice(0, 8);

  // Se não houver resultados
  if (!mostrarProdutos) {
    return (
      <div className="search-dropdown search-dropdown-results">
        <div className="search-dropdown-header">
          <i className="bi bi-search me-2"></i>
          <span>Resultados para "{termoBusca}"</span>
        </div>
        
        <div className="search-empty-state" style={{ padding: '2rem 1rem' }}>
          <i className="bi bi-search" style={{ fontSize: '2.5rem' }}></i>
          <p>Nenhum produto encontrado</p>
          <span>Tente buscar por outro termo</span>
        </div>
      </div>
    );
  }

  // ============================================
  // LAYOUT APENAS COM PRODUTOS
  // ============================================
  return (
    <div className="search-dropdown search-dropdown-results">
      <div className="search-dropdown-header">
        <i className="bi bi-search me-2"></i>
        <span>Produtos para "{termoBusca}"</span>
      </div>

      {/* LISTA DE PRODUTOS COM SCROLL */}
      <div className="search-products-column">
        <div className="search-products-list">
          {produtosParaMostrar.map(produto => {
            const precoOriginal = produto.preco.toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            });
            const precoDesconto = (produto.preco * 0.95).toLocaleString('pt-BR', { 
              style: 'currency', 
              currency: 'BRL' 
            });
            
            return (
              <button
                key={produto.id}
                className="search-product-item"
                onClick={() => handleProdutoClick(produto)}
              >
                <div className="search-product-image">
                  <img src={produto.imagem} alt={produto.nome} />
                </div>
                <div className="search-product-info">
                  <h4 className="search-product-name">{produto.nome}</h4>
                  <div className="search-product-price">
                    <span className="price-old">{precoOriginal}</span>
                    <span className="price-new">{precoDesconto}</span>
                  </div>
                </div>
                <i className="bi bi-arrow-right-circle"></i>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOTÃO VER TODOS */}
      {produtosFiltrados.length > 8 && (
        <button
          className="search-view-all"
          onClick={() => {
            navigate(`/busca?q=${encodeURIComponent(termoBusca)}`);
            setDropdownAberto(false);
            setTermoBusca(''); // Limpa o input
          }}
        >
          <span>Ver todos os {produtosFiltrados.length} resultados</span>
          <i className="bi bi-arrow-right"></i>
        </button>
      )}
    </div>
  );
};

export default SearchDropdown;