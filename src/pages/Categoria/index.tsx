import { useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Titulo from "../../components/Titulo";
import categorias from "../../data/json/categorias.json";
import { IProduto } from "../../interface/IProduto";
import "./Categoria.scss";
import Card from "../../components/Card";
import { FiltrosSidebar } from "../../components/Filter/FiltrosSidebar";
import { FiltrosMobile } from "../../components/Filter/FiltrosMobile";
import { useFiltros } from "../../hooks/useFiltros";

type CategoriaKeys = keyof typeof categorias;

const Categoria = () => {
  const { categoriaId } = useParams<{ categoriaId: string }>();
  
  const isTodasCategorias = !categoriaId || categoriaId === "todas";
  const categoriaAtual = isTodasCategorias ? "todas" : categoriaId;
  
  const produtos = useMemo(() => {
    if (isTodasCategorias) {
      const todosProdutos: IProduto[] = [];
      Object.values(categorias).forEach(categoria => {
        if (Array.isArray(categoria)) {
          todosProdutos.push(...categoria);
        }
      });
      return todosProdutos;
    } else {
      const categoriaChave = categoriaId as CategoriaKeys;
      return categoriaChave && categorias[categoriaChave] ? categorias[categoriaChave] : [];
    }
  }, [categoriaId, isTodasCategorias]);

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
    produtos,
    aplicarFiltroCategoria: isTodasCategorias, 
    buscaAbrangente: false 
  });

  useEffect(() => {
    resetarFiltros();
  }, [categoriaAtual]); 

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [categoriaAtual]);

  if (!isTodasCategorias && produtos.length === 0) {
    return (
      <section className="categoria-container">
        <h2>Categoria não encontrada</h2>
        <Link to="/categorias/todas">Voltar para todas as categorias</Link>
      </section>
    );
  }

  const tituloPagina = isTodasCategorias 
    ? "Todas as Categorias" 
    : categoriaId!.charAt(0).toUpperCase() + categoriaId!.slice(1);

  return (
    <section className={`categoria-container ${isTodasCategorias ? 'todas-categorias' : ''}`}>
      <Titulo texto={tituloPagina} />

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
            showCategorias={isTodasCategorias}
          />
        </aside>

        <main className="produtos-area">
          <div className="produtos-header">
            <p className="resultados-count">
              {produtosFiltrados.length} {produtosFiltrados.length === 1 ? 'produto encontrado' : 'produtos encontrados'}
              {!isTodasCategorias && ` em ${tituloPagina}`}
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
                <p>Nenhum produto encontrado</p>
                <span>Tente ajustar os filtros ou buscar por outro termo</span>
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
        showCategorias={isTodasCategorias}
      />
    </section>
  );
};

export default Categoria;