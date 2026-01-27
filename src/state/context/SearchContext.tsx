import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { IProduto } from '../../interface/IProduto';
import categorias from '../../data/json/categorias.json';
import maisVendidos from '../../data/json/maisVendidos.json';

interface SearchContextType {
  termoBusca: string;
  setTermoBusca: (termo: string) => void;
  dropdownAberto: boolean;
  setDropdownAberto: (aberto: boolean) => void;
  produtosFiltrados: IProduto[];
  categoriasFiltradas: Array<{ nome: string; path: string; qtdProdutos: number }>;
  categoriasSugeridas: string[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: ReactNode }) => {
  const [termoBusca, setTermoBusca] = useState('');
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [produtosFiltrados, setProdutosFiltrados] = useState<IProduto[]>([]);
  const [categoriasFiltradas, setCategoriasFiltradas] = useState<Array<{ nome: string; path: string; qtdProdutos: number }>>([]);

  // Categorias principais (fixas - quando não há busca)
  const categoriasSugeridas = [
    'Eletrônicos',
    'Informática', 
    'Áudio e Vídeo',
    'Games',
    'Cozinha',
    'Eletrodomésticos'
  ];

  // Mapeamento de categorias
  const categoriasMap = {
    'eletronicos': 'Eletrônicos',
    'informatica': 'Informática',
    'audio-e-video': 'Áudio e Vídeo',
    'games': 'Games',
    'cozinha': 'Cozinha',
    'eletrodomesticos': 'Eletrodomésticos'
  };

  // Todos os produtos disponíveis
  const todosProdutos = [
    ...Object.values(categorias).flat(),
    ...maisVendidos
  ].filter((produto, index, self) => 
    self.findIndex(p => p.id === produto.id) === index
  );

  useEffect(() => {
    if (termoBusca.trim() === '') {
      setProdutosFiltrados([]);
      setCategoriasFiltradas([]);
      return;
    }

    const termoLower = termoBusca.toLowerCase();

    // 1. Filtrar produtos
    const produtosEncontrados = todosProdutos.filter(produto =>
      produto.nome.toLowerCase().includes(termoLower) ||
      produto.descricao?.toLowerCase().includes(termoLower)
    ).slice(0, 6);

    setProdutosFiltrados(produtosEncontrados);

    // 2. Filtrar CATEGORIAS que têm produtos relacionados
    const categoriasComProdutos: Array<{ nome: string; path: string; qtdProdutos: number }> = [];

    Object.entries(categorias).forEach(([chave, produtosCategoria]) => {
      // Contar quantos produtos dessa categoria correspondem à busca
      const produtosRelacionados = produtosCategoria.filter(produto =>
        produto.nome.toLowerCase().includes(termoLower) ||
        produto.descricao?.toLowerCase().includes(termoLower)
      );

      if (produtosRelacionados.length > 0) {
        categoriasComProdutos.push({
          nome: categoriasMap[chave as keyof typeof categoriasMap] || chave,
          path: `/categorias/${chave}`,
          qtdProdutos: produtosRelacionados.length
        });
      }
    });

    // Ordenar por quantidade de produtos (mais relevantes primeiro)
    categoriasComProdutos.sort((a, b) => b.qtdProdutos - a.qtdProdutos);

    setCategoriasFiltradas(categoriasComProdutos);
  }, [termoBusca]);

  return (
    <SearchContext.Provider
      value={{
        termoBusca,
        setTermoBusca,
        dropdownAberto,
        setDropdownAberto,
        produtosFiltrados,
        categoriasFiltradas,
        categoriasSugeridas
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch deve ser usado dentro de SearchProvider');
  }
  return context;
};