
export interface IProduto {
    id: number;
    nome: string;
    descricao: string;
    imagem: string;
    preco: number;
    quantidade: number; 
    avaliacao?: number;
    categoria: string;  
    marca: string;     
    vendas?: number;
    quantidadeCarrinho?: number;
    estoqueDisponivel?: number; 
}
