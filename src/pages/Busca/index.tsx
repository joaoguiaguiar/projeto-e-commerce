import { useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Titulo from "../../components/Titulo";
import Card from "../../components/Card";
import { IProduto } from "../../interface/IProduto";
import categorias from "../../data/json/categorias.json";
import "./BuscaResultados.scss";
import '../Categoria/Categoria.scss';
import { FiltrosSidebar } from "../../components/Filter/FiltrosSidebar";
import { FiltrosMobile } from "../../components/Filter/FiltrosMobile";
import { useFiltros } from "../../hooks/useFiltros";

const BuscaResultados = () => {
  const [searchParams] = useSearchParams();
  const termoBusca = searchParams.get('q') || '';
  
  const todosProdutos = useMemo(() => {
    const produtos: IProduto[] = [];
    Object.values(categorias).forEach(categoria => {
      if (Array.isArray(categoria)) {
        produtos.push(...categoria);
      }
    });
    return produtos;
  }, []);

  const {
    busca,
    ordenacao,
    visualizacao,
    filtros,
    mobileFiltersOpen,
    isMobile,
    setBusca,
    setOrdenacao,
    setVisualizacao,
    setMobileFiltersOpen,
    handlePrecoChange,
    handleAvaliacaoChange,
    handleMarcaChange,
    handleCategoriaChange,
    limparFiltros,
    produtosFiltrados,
    todasCategorias,
    todasMarcas,
    resetarFiltros
  } = useFiltros({
    produtos: todosProdutos,
    termoBuscaInicial: termoBusca,
    aplicarFiltroCategoria: true, 
    buscaAbrangente: true 
  });

  useEffect(() => {
    setBusca(termoBusca);
    resetarFiltros();
  }, [termoBusca]); 

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [termoBusca]); 

  return (
    <section className="categoria-container todas-categorias">
      <nav aria-label="breadcrumb" className="breadcrumb-custom">
        <Link to="/">Início</Link>
        <span className="active">Busca por "{termoBusca}"</span>
      </nav>

      <Titulo texto={`Resultados para "${termoBusca}"`} />

      <div className="categoria-content">
        <aside className="filtros-sidebar">
          <FiltrosSidebar
            todasCategorias={todasCategorias}
            todasMarcas={todasMarcas}
            filtros={filtros}
            onPrecoChange={handlePrecoChange}
            onAvaliacaoChange={handleAvaliacaoChange}
            onMarcaChange={handleMarcaChange}
            onCategoriaChange={handleCategoriaChange}
            onLimparFiltros={limparFiltros}
            showCategorias={true}
          />
        </aside>

        <main className="produtos-area">
          <div className="produtos-header">
            <p className="resultados-count">
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'} para "{termoBusca}"
            </p>

            <div className="controles">
              <div className="ordenacao">
                <label>Ordenar por:</label>
                <select
                  value={ordenacao}
                  onChange={(e) => setOrdenacao(e.target.value)}
                >
                  <option value="relevantes">Mais relevantes</option>
                  <option value="menor-preco">Menor preço</option>
                  <option value="maior-preco">Maior preço</option>
                  <option value="mais-vendidos">Mais vendidos</option>
                  <option value="melhor-avaliacao">Melhor avaliação</option>
                </select>
              </div>

              {isMobile && (
                <button 
                  className="mobile-filter-btn"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <span className="filter-icon">☰</span>
                  <span className="filter-text">Filtrar</span>
                </button>
              )}

              {!isMobile && (
                <div className="visualizacao-toggle">
                  <button
                    className={visualizacao === "grid" ? "active" : ""}
                    onClick={() => setVisualizacao("grid")}
                    title="Visualização em grade"
                  >
                    <span className="icon">⊞</span>
                    <span className="text">Grade</span>
                  </button>
                  <button
                    className={visualizacao === "lista" ? "active" : ""}
                    onClick={() => setVisualizacao("lista")}
                    title="Visualização em lista"
                  >
                    <span className="icon">☰</span>
                    <span className="text">Lista</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className={`lista-cards ${visualizacao}`}>
            {produtosFiltrados.length > 0 ? (
              <Card produtos={produtosFiltrados} visualizacao={visualizacao} />
            ) : (
              <div className="nao-encontrado">
                <p>Nenhum produto encontrado para "{termoBusca}"</p>
                <span>Tente ajustar os filtros ou buscar por outro termo</span>
                <div style={{ marginTop: '1.5rem' }}>
                  <Link to="/" className="btn btn-primary">
                    Voltar para página inicial
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <FiltrosMobile
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        onApply={() => setMobileFiltersOpen(false)}
        todasCategorias={todasCategorias}
        todasMarcas={todasMarcas}
        filtros={filtros}
        onPrecoChange={handlePrecoChange}
        onAvaliacaoChange={handleAvaliacaoChange}
        onMarcaChange={handleMarcaChange}
        onCategoriaChange={handleCategoriaChange}
        onLimparFiltros={limparFiltros}
        showCategorias={true}
      />
    </section>
  );
};

export default BuscaResultados;