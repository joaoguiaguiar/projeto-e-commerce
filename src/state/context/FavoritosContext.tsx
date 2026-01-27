import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { IProduto } from '../../interface/IProduto';

interface FavoritosContextType {
  favoritos: IProduto[];
  adicionarFavorito: (produto: IProduto) => void;
  removerFavorito: (produtoId: number) => void;
  isFavorito: (produtoId: number) => boolean;
  toggleFavorito: (produto: IProduto) => void;
}

const FavoritosContext = createContext<FavoritosContextType | undefined>(undefined);

export const FavoritosProvider = ({ children }: { children: ReactNode }) => {
  const [favoritos, setFavoritos] = useState<IProduto[]>([]);
  const [carregado, setCarregado] = useState(false);

  // Carregar favoritos do localStorage ao iniciar
  useEffect(() => {
    const carregarFavoritos = () => {
      try {
        const favoritosSalvos = localStorage.getItem('favoritos');
        if (favoritosSalvos) {
          const parsedFavoritos = JSON.parse(favoritosSalvos);
          // Validação básica
          if (Array.isArray(parsedFavoritos)) {
            setFavoritos(parsedFavoritos);
          }
        }
      } catch (error) {
        console.log('Erro ao carregar favoritos:', error);
        // Se der erro, limpa o localStorage
        localStorage.removeItem('favoritos');
      } finally {
        setCarregado(true);
      }
    };

    carregarFavoritos();
  }, []);

  // Salvar favoritos no localStorage sempre que mudarem
  useEffect(() => {
    if (carregado) {
      try {
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
      } catch (error) {
        console.error('Erro ao salvar favoritos:', error);
      }
    }
  }, [favoritos, carregado]);

  const adicionarFavorito = (produto: IProduto) => {
    setFavoritos((prev) => {
      // Verificar se já existe
      if (prev.some(fav => fav.id === produto.id)) {
        return prev;
      }
      return [...prev, produto];
    });
  };

  const removerFavorito = (produtoId: number) => {
    setFavoritos((prev) => prev.filter(fav => fav.id !== produtoId));
  };

  const isFavorito = (produtoId: number): boolean => {
    return favoritos.some(fav => fav.id === produtoId);
  };

  const toggleFavorito = (produto: IProduto) => {
    if (isFavorito(produto.id)) {
      removerFavorito(produto.id);
    } else {
      adicionarFavorito(produto);
    }
  };

  return (
    <FavoritosContext.Provider
      value={{
        favoritos,
        adicionarFavorito,
        removerFavorito,
        isFavorito,
        toggleFavorito,
      }}
    >
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => {
  const context = useContext(FavoritosContext);
  if (!context) {
    throw new Error('useFavoritos deve ser usado dentro de FavoritosProvider');
  }
  return context;
};