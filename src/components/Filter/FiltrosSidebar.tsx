import React from 'react';
import { FiltrosState } from '../../hooks/useFiltros';

interface FiltrosSidebarProps {
  todasCategorias: string[];
  todasMarcas: string[];
  filtros: FiltrosState;
  onPrecoChange: (valor: string) => void;
  onAvaliacaoChange: (valor: string) => void;
  onMarcaChange: (marca: string) => void;
  onCategoriaChange: (categoria: string) => void;
  onLimparFiltros: () => void;
  showCategorias?: boolean;
  // ADICIONE ESTAS PROPS
  busca?: string;
  onBuscaChange?: (busca: string) => void;
}

export const FiltrosSidebar: React.FC<FiltrosSidebarProps> = ({
  todasCategorias,
  todasMarcas,
  filtros,
  onPrecoChange,
  onAvaliacaoChange,
  onMarcaChange,
  onCategoriaChange,
  onLimparFiltros,
  showCategorias = true,
  busca,
  onBuscaChange
}) => {
  return (
    <>
      <h3>Filtrar por</h3>

      {/* INPUT DE BUSCA - OPICIONAL */}
      {onBuscaChange && (
        <div className="filtro-grupo">
          <h4>Busca</h4>
          <div className="filtro-opcoes">
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={busca || ''}
              onChange={(e) => onBuscaChange(e.target.value)}
              className="busca-input"
            />
          </div>
        </div>
      )}

      {showCategorias && todasCategorias.length > 0 && (
        <div className="filtro-grupo">
          <h4>Categorias</h4>
          <div className="filtro-opcoes">
            {todasCategorias.map(categoria => (
              <label key={categoria}>
                <input
                  type="checkbox"
                  checked={filtros.categoriasSelecionadas.includes(categoria)}
                  onChange={() => onCategoriaChange(categoria)}
                />
                {categoria}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ... resto do código igual ... */}
      <div className="filtro-grupo">
        <h4>Preço</h4>
        <div className="filtro-opcoes">
          <label>
            <input
              type="radio"
              name="preco"
              value="todos"
              checked={filtros.preco === "todos"}
              onChange={() => onPrecoChange("todos")}
            />
            Todos os preços
          </label>
          <label>
            <input
              type="radio"
              name="preco"
              value="ate-500"
              checked={filtros.preco === "ate-500"}
              onChange={() => onPrecoChange("ate-500")}
            />
            Até R$ 500
          </label>
          <label>
            <input
              type="radio"
              name="preco"
              value="500-1000"
              checked={filtros.preco === "500-1000"}
              onChange={() => onPrecoChange("500-1000")}
            />
            R$ 500 - R$ 1000
          </label>
          <label>
            <input
              type="radio"
              name="preco"
              value="1000-mais"
              checked={filtros.preco === "1000-mais"}
              onChange={() => onPrecoChange("1000-mais")}
            />
            Acima de R$ 1000
          </label>
        </div>
      </div>

      <div className="filtro-grupo">
        <h4>Avaliação</h4>
        <div className="filtro-opcoes">
          <label>
            <input
              type="checkbox"
              checked={filtros.avaliacao.includes("5-estrelas")}
              onChange={() => onAvaliacaoChange("5-estrelas")}
            />
            ⭐⭐⭐⭐⭐ 5 estrelas
          </label>
          <label>
            <input
              type="checkbox"
              checked={filtros.avaliacao.includes("4-estrelas")}
              onChange={() => onAvaliacaoChange("4-estrelas")}
            />
            ⭐⭐⭐⭐ 4+ estrelas
          </label>
          <label>
            <input
              type="checkbox"
              checked={filtros.avaliacao.includes("3-estrelas")}
              onChange={() => onAvaliacaoChange("3-estrelas")}
            />
            ⭐⭐⭐ 3+ estrelas
          </label>
        </div>
      </div>

      <div className="filtro-grupo">
        <h4>Marca</h4>
        <div className="filtro-opcoes">
          {todasMarcas.map(marca => (
            <label key={marca}>
              <input
                type="checkbox"
                checked={filtros.marcas.includes(marca)}
                onChange={() => onMarcaChange(marca)}
              />
              {marca}
            </label>
          ))}
        </div>
      </div>

      <button className="limpar-filtros" onClick={onLimparFiltros}>
        Limpar filtros
      </button>
    </>
  );
};