import { useState, useMemo, useEffect, useCallback } from "react";
import { IProduto } from "../interface/IProduto";

export interface FiltrosState {
  preco: string;
  avaliacao: string[];
  marcas: string[];
  categoriasSelecionadas: string[];
}

interface UseFiltrosProps {
  produtos: IProduto[];
  termoBuscaInicial?: string;
  // Controla se deve aplicar filtro de categoria (false para páginas de categoria específica)
  aplicarFiltroCategoria?: boolean;
  // Controla se busca deve ser abrangente (nome, desc, categoria, marca)
  buscaAbrangente?: boolean;
}

interface UseFiltrosReturn {
  busca: string;
  ordenacao: string;
  visualizacao: "grid" | "lista";
  filtros: FiltrosState;
  mobileFiltersOpen: boolean;
  isMobile: boolean;
  
  setBusca: (busca: string) => void;
  setOrdenacao: (ordenacao: string) => void;
  setVisualizacao: (visualizacao: "grid" | "lista") => void;
  setMobileFiltersOpen: (open: boolean) => void;
  
  handlePrecoChange: (valor: string) => void;
  handleAvaliacaoChange: (valor: string) => void;
  handleMarcaChange: (marca: string) => void;
  handleCategoriaChange: (categoria: string) => void;
  limparFiltros: () => void;
  resetarFiltros: () => void;
  
  produtosFiltrados: IProduto[];
  todasCategorias: string[];
  todasMarcas: string[];
  produtosFiltradosCount: number;
}

export const useFiltros = ({ 
  produtos, 
  termoBuscaInicial = "",
  aplicarFiltroCategoria = true,
  buscaAbrangente = false
}: UseFiltrosProps): UseFiltrosReturn => {
  const [busca, setBusca] = useState<string>(termoBuscaInicial);
  const [ordenacao, setOrdenacao] = useState<string>("relevantes");
  const [visualizacao, setVisualizacao] = useState<"grid" | "lista">("grid");
  const [filtros, setFiltros] = useState<FiltrosState>({
    preco: "todos",
    avaliacao: [],
    marcas: [],
    categoriasSelecionadas: []
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Extrair todas as categorias únicas e marcas
  const { todasCategorias, todasMarcas } = useMemo(() => {
    const categoriasSet = new Set<string>();
    const marcasSet = new Set<string>();
    
    produtos.forEach((item: IProduto) => {
      if (item.categoria) categoriasSet.add(item.categoria);
      if (item.marca) marcasSet.add(item.marca);
    });
    
    return {
      todasCategorias: Array.from(categoriasSet).sort(),
      todasMarcas: Array.from(marcasSet).sort()
    };
  }, [produtos]);

  // Detecta se está em mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 968);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Impede rolagem quando off-canvas estiver aberto
  useEffect(() => {
    if (mobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [mobileFiltersOpen]);

  // Funções de filtro
  const handlePrecoChange = useCallback((valor: string) => {
    setFiltros(prev => ({ ...prev, preco: valor }));
  }, []);

  const handleAvaliacaoChange = useCallback((valor: string) => {
    setFiltros(prev => {
      const novasAvaliacoes = prev.avaliacao.includes(valor)
        ? prev.avaliacao.filter(v => v !== valor)
        : [...prev.avaliacao, valor];
      return { ...prev, avaliacao: novasAvaliacoes };
    });
  }, []);

  const handleMarcaChange = useCallback((marca: string) => {
    setFiltros(prev => {
      const novasMarcas = prev.marcas.includes(marca)
        ? prev.marcas.filter(m => m !== marca)
        : [...prev.marcas, marca];
      return { ...prev, marcas: novasMarcas };
    });
  }, []);

  const handleCategoriaChange = useCallback((categoria: string) => {
    setFiltros(prev => {
      const novasCategorias = prev.categoriasSelecionadas.includes(categoria)
        ? prev.categoriasSelecionadas.filter(c => c !== categoria)
        : [...prev.categoriasSelecionadas, categoria];
      return { ...prev, categoriasSelecionadas: novasCategorias };
    });
  }, []);

  const limparFiltros = useCallback(() => {
    setFiltros({
      preco: "todos",
      avaliacao: [],
      marcas: [],
      categoriasSelecionadas: []
    });
    setBusca("");
  }, []);

  const resetarFiltros = useCallback(() => {
    setFiltros({
      preco: "todos",
      avaliacao: [],
      marcas: [],
      categoriasSelecionadas: []
    });
    setBusca("");
    setOrdenacao("relevantes");
  }, []);

  // Filtrar produtos
  const produtosFiltrados = useMemo(() => {
    let resultado = [...produtos];

    // Busca (abrangente ou apenas nome)
    if (busca.trim()) {
      const termo = busca.toLowerCase();
      resultado = resultado.filter((item: IProduto) => {
        if (buscaAbrangente) {
          return (
            item.nome.toLowerCase().includes(termo) ||
            (item.descricao && item.descricao.toLowerCase().includes(termo)) ||
            (item.categoria && item.categoria.toLowerCase().includes(termo)) ||
            (item.marca && item.marca.toLowerCase().includes(termo))
          );
        } else {
          return item.nome.toLowerCase().includes(termo);
        }
      });
    }

    // Filtro de Categoria (apenas se aplicarFiltroCategoria for true)
    if (aplicarFiltroCategoria && filtros.categoriasSelecionadas.length > 0) {
      resultado = resultado.filter(item =>
        item.categoria && filtros.categoriasSelecionadas.includes(item.categoria)
      );
    }

    // Filtro de Preço
    if (filtros.preco !== "todos") {
      resultado = resultado.filter(item => {
        switch (filtros.preco) {
          case "ate-500": return item.preco <= 500;
          case "500-1000": return item.preco >= 500 && item.preco <= 1000;
          case "1000-mais": return item.preco > 1000;
          default: return true;
        }
      });
    }

    // Filtro de Avaliação
    if (filtros.avaliacao.length > 0) {
      resultado = resultado.filter(item => {
        const avaliacaoItem = item.avaliacao || 0;
        return filtros.avaliacao.some(filtro => {
          switch (filtro) {
            case "5-estrelas": return avaliacaoItem >= 4.5;
            case "4-estrelas": return avaliacaoItem >= 4 && avaliacaoItem < 4.5;
            case "3-estrelas": return avaliacaoItem >= 3 && avaliacaoItem < 4;
            default: return false;
          }
        });
      });
    }

    // Filtro de Marca
    if (filtros.marcas.length > 0) {
      resultado = resultado.filter(item =>
        item.marca && filtros.marcas.includes(item.marca)
      );
    }

    // Ordenação
    switch (ordenacao) {
      case "menor-preco": 
        resultado.sort((a, b) => a.preco - b.preco); 
        break;
      case "maior-preco": 
        resultado.sort((a, b) => b.preco - a.preco); 
        break;
      case "mais-vendidos": 
        resultado.sort((a, b) => (b.vendas || 0) - (a.vendas || 0)); 
        break;
      case "melhor-avaliacao": 
        resultado.sort((a, b) => (b.avaliacao || 0) - (a.avaliacao || 0)); 
        break;
      default: 
        // Mantém ordem original para "relevantes"
        break;
    }

    return resultado;
  }, [produtos, busca, filtros, ordenacao, aplicarFiltroCategoria, buscaAbrangente]);

  return {
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
    resetarFiltros,
    
    produtosFiltrados,
    todasCategorias,
    todasMarcas,
    produtosFiltradosCount: produtosFiltrados.length
  };
};