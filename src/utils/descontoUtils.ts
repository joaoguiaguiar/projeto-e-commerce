export const PERCENTUAL_DESCONTO = 0.05; // 5% de desconto


export const calcularPrecoComDesconto = (precoOriginal: number): number => {
  return precoOriginal * (1 - PERCENTUAL_DESCONTO);
};


export const calcularEconomia = (precoOriginal: number): number => {
  return precoOriginal * PERCENTUAL_DESCONTO;
};


export const formatarPreco = (valor: number): string => {
  return valor.toFixed(2).replace('.', ',');
};


export const calcularDesconto = (precoOriginal: number) => {
  const precoComDesconto = calcularPrecoComDesconto(precoOriginal);
  const economia = calcularEconomia(precoOriginal);
  
  return {
    precoOriginal,
    precoComDesconto,
    economia,
    percentualDesconto: PERCENTUAL_DESCONTO * 100, 
  };
};