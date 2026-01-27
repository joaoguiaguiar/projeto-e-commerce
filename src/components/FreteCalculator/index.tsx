import { useState } from 'react';
import './FreteCalculator.scss';

interface FreteCalculatorProps {
  cepDefault?: string;
}

const FreteCalculator = ({ cepDefault = '' }: FreteCalculatorProps) => {
  const [cep, setCep] = useState(cepDefault);
  const [loading, setLoading] = useState(false);
  const [freteInfo, setFreteInfo] = useState<{
    cep: string;
    prazo: string;
    valor: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const buscarEnderecoPorCEP = async (cepInput: string) => {
    const cepNumerico = cepInput.replace(/\D/g, '');
    
    if (cepNumerico.length !== 8) {
      setError('CEP inválido');
      return null;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      const dados = await response.json();
      
      if (dados.erro) {
        setError('CEP não encontrado');
        return null;
      }
      
      return {
        cidade: dados.localidade,
        estado: dados.uf
      };
    } catch (err) {
      setError('Erro ao buscar CEP');
      return null;
    }
  };

  const calcularFrete = async () => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      setError('Digite um CEP válido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Simulação de busca
      const enderecoData = await buscarEnderecoPorCEP(cep);
      
      if (!enderecoData) {
        setLoading(false);
        return;
      }

      // Simulação de cálculo
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Valores mais realistas
      const valoresFrete = [
        { prazo: '3-5 dias', valor: 15.90 },
        { prazo: '5-8 dias', valor: 12.50 },
        { prazo: '8-12 dias', valor: 9.90 }
      ];
      
      const freteEscolhido = valoresFrete[Math.floor(Math.random() * valoresFrete.length)];
      
      const info = {
        cep: cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'),
        prazo: freteEscolhido.prazo,
        valor: freteEscolhido.valor
      };

      setFreteInfo(info);

    } catch (err) {
      setError('Erro ao calcular frete');
    } finally {
      setLoading(false);
    }
  };

  const formatarCEP = (value: string) => {
    const numeros = value.replace(/\D/g, '');
    if (numeros.length <= 5) return numeros;
    return `${numeros.slice(0, 5)}-${numeros.slice(5, 8)}`;
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCEP = formatarCEP(e.target.value);
    setCep(formattedCEP);
    if (error) setError(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calcularFrete();
    }
  };

  return (
    <div className="frete-calculator-compact">
      <div className="frete-header-compact">
        <i className="bi bi-truck"></i>
        <span>Calcular frete e prazo</span>
      </div>

      <div className="frete-input-compact">
        <input
          type="text"
          value={cep}
          onChange={handleCEPChange}
          onKeyPress={handleKeyPress}
          placeholder="00000-000"
          maxLength={9}
          className={error ? 'error' : ''}
        />
        <button 
          onClick={calcularFrete}
          disabled={loading || !cep || cep.replace(/\D/g, '').length !== 8}
          className="btn-ok"
        >
          {loading ? '...' : 'OK'}
        </button>
      </div>
      
      {error && <span className="error-message-compact">{error}</span>}

      {freteInfo && (
        <div className="frete-result-compact">
          <div className="frete-success-compact">
            <i className="bi bi-check-circle"></i>
            <span>Chegará em {freteInfo.prazo}</span>
          </div>
          <div className="frete-value-compact">
            <span>Frete:</span>
            <strong>R$ {freteInfo.valor.toFixed(2).replace('.', ',')}</strong>
          </div>
        </div>
      )}

      <div className="frete-retirada">
        <i className="bi bi-shop"></i>
        <span>
          <strong>Retire em 2h</strong> em lojas participantes
        </span>
      </div>
    </div>
  );
};

export default FreteCalculator;