import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { IProduto } from "../../interface/IProduto";
import { IPedido } from "../../interface/IPedido";
import categorias from "../../data/json/categorias.json";
import maisVendidos from "../../data/json/maisVendidos.json";

interface CarrinhoContextData {
  itensCarrinho: IProduto[];
  pedidos: IPedido[];
  adicionarAoCarrinho: (item: IProduto) => void;
  removerDoCarrinho: (id: number) => void;
  atualizarQuantidade: (id: number, quantidade: number) => void; 
  limparCarrinho: () => void;
  gerarPedido: (usuario: { cep: string }) => void;
  excluirPedido: (pedidoId: number) => void; 
  excluirTodosPedidos: () => void;
  getEstoqueProduto: (id: number) => number; 
}

const CarrinhoContext = createContext<CarrinhoContextData | undefined>(undefined);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const [itensCarrinho, setItensCarrinho] = useState<IProduto[]>([]);
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [carregado, setCarregado] = useState(false);

  // CARREGAR Carrinho do localStorage ao iniciar
  useEffect(() => {
    const carregarCarrinho = () => {
      try {
        const carrinhoSalvo = localStorage.getItem('carrinho');
        if (carrinhoSalvo) {
          const parsedCarrinho = JSON.parse(carrinhoSalvo);
          if (Array.isArray(parsedCarrinho)) {
            setItensCarrinho(parsedCarrinho);
          }
        }
      } catch (error) {
        console.log('Erro ao carregar carrinho:', error);
        localStorage.removeItem('carrinho');
      }
    };

    carregarCarrinho();
  }, []);

  // SALVAR Carrinho no localStorage sempre que mudar
  useEffect(() => {
    if (itensCarrinho.length > 0) {
      try {
        localStorage.setItem('carrinho', JSON.stringify(itensCarrinho));
      } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
      }
    } else {
      localStorage.removeItem('carrinho');
    }
  }, [itensCarrinho]);

  // Carregar pedidos
  useEffect(() => {
    const pedidosSalvos = JSON.parse(localStorage.getItem("pedidos") || "[]");
    setPedidos(pedidosSalvos);
    setCarregado(true);
  }, []);

  // Função para obter o estoque atual de um produto
  const getEstoqueProduto = (id: number): number => {
    // Busca em todas as categorias
    const todosProdutos = [
      ...categorias.eletronicos,
      ...categorias.informatica,
      ...categorias.cozinha,
      ...categorias["audio-e-video"],
      ...categorias.games,
      ...categorias.eletrodomesticos,
      ...maisVendidos
    ];
    
    const produtoOriginal = todosProdutos.find(p => p.id === id);
    return produtoOriginal?.quantidade || 0;
  };

  const adicionarAoCarrinho = (item: IProduto) => {
    // Verifica se o produto está disponível em estoque
    const estoqueDisponivel = getEstoqueProduto(item.id);
    
    if (estoqueDisponivel <= 0) {
      alert("Produto indisponível no momento! Não é possível adicionar ao carrinho.");
      return;
    }

    setItensCarrinho((prev) => {
      const itemExistente = prev.find((produto) => produto.id === item.id);
      
      if (itemExistente) {
        // Verifica se a quantidade no carrinho + 1 excede o estoque
        const quantidadeNoCarrinho = itemExistente.quantidade || 0;
        
        if (quantidadeNoCarrinho + 1 > estoqueDisponivel) {
          return prev; // Não altera o carrinho
        }
        
        return prev.map((produto) =>
          produto.id === item.id
            ? { 
                ...produto, 
                quantidade: produto.quantidade + 1,
                estoqueDisponivel 
              }
            : produto
        );
      }
      
      // Para um novo item
      return [...prev, { 
        ...item, 
        quantidade: 1,
        estoqueDisponivel 
      }];
    });
  };

  const atualizarQuantidade = (id: number, quantidade: number) => {
    if (quantidade < 1) {
      removerDoCarrinho(id);
      return;
    }
    
    const estoqueDisponivel = getEstoqueProduto(id);
    
    if (quantidade > estoqueDisponivel) {
      return;
    }
    
    setItensCarrinho((prev) =>
      prev.map((produto) =>
        produto.id === id 
          ? { 
              ...produto, 
              quantidade,
              estoqueDisponivel 
            } 
          : produto
      )
    );
  };
  
  const removerDoCarrinho = (id: number) => {
    setItensCarrinho((prev) => prev.filter((item) => item.id !== id));
  };

  const gerarPedido = (usuario: { cep: string }) => {
    // Verifica se o CEP é uma string válida
    if (!usuario.cep || typeof usuario.cep !== 'string' || usuario.cep.trim() === '') {
      alert("Por favor, insira um CEP válido!");
      return;
    }

    // Verifica se há itens no carrinho
    if (itensCarrinho.length === 0) {
      alert("Carrinho vazio! Adicione produtos antes de finalizar o pedido.");
      return;
    }

    const novoPedido: IPedido = {
      id: Math.floor(Math.random() * 1000000),
      data: new Date().toISOString(),
      total: itensCarrinho.reduce(
        (acc, item) => acc + item.preco * (item.quantidade || 1),
        0
      ),
      entrega: usuario.cep,
      produtos: [...itensCarrinho],
    };

    setPedidos((prev) => {
      const pedidosAtualizados = [novoPedido, ...prev];
      localStorage.setItem("pedidos", JSON.stringify(pedidosAtualizados)); 
      return pedidosAtualizados;
    });
    
    // LIMPAR Carrinho E SALVAR NOVO ESTADO
    limparCarrinho();
    alert("Pedido adicionado com sucesso!");
  };

  const excluirPedido = (pedidoId: number) => {
    const pedidosAtualizados = pedidos.filter((pedido) => pedido.id !== pedidoId);
    setPedidos(pedidosAtualizados);
    localStorage.setItem("pedidos", JSON.stringify(pedidosAtualizados));
  };

  const excluirTodosPedidos = () => {
    if (window.confirm("Você tem certeza que deseja excluir todos os pedidos?")) {
      setPedidos([]);
      localStorage.removeItem("pedidos");
    }
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
    localStorage.removeItem('carrinho'); 
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itensCarrinho,
        pedidos,
        adicionarAoCarrinho,
        removerDoCarrinho,
        atualizarQuantidade, 
        limparCarrinho,
        gerarPedido,
        excluirPedido,
        excluirTodosPedidos,
        getEstoqueProduto,
      }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = (): CarrinhoContextData => {
  const context = useContext(CarrinhoContext);
  if (!context) {
    throw new Error("useCarrinho deve ser usado dentro de um CarrinhoProvider");
  }
  return context;
};