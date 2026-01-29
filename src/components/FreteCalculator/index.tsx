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
      return null;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      const dados = await response.json();
      
      // MESMO SE O VIACEP NÃO ENCONTRAR, AINDA VAMOS SIMULAR O FRETE
      // Em uma loja real, você teria sua própria base de fretes
      if (dados.erro) {
        console.log('CEP não encontrado no ViaCEP, mas vamos simular frete mesmo assim');
        // Retorna um endereço genérico para simulação
        return {
          cidade: 'Cidade não identificada',
          estado: 'UF'
        };
      }
      
      return {
        cidade: dados.localidade,
        estado: dados.uf
      };
    } catch (err) {
      console.log('Erro na API, mas vamos simular frete mesmo assim');
      // Mesmo com erro na API, simula frete
      return {
        cidade: 'Cidade não identificada',
        estado: 'UF'
      };
    }
  };

  const calcularFrete = async () => {
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      setError('Digite um CEP válido com 8 dígitos');
      return;
    }

    setLoading(true);
    setError(null);
    setFreteInfo(null);

    try {
      // Tenta buscar endereço, mas mesmo se falhar, continua
      const enderecoData = await buscarEnderecoPorCEP(cep);
      
      // Simulação de cálculo (500ms)
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Valores de frete baseados no CEP (região)
      const cepNum = parseInt(cep.replace(/\D/g, ''));
      
      // Cálculo baseado na região do CEP (primeiro dígito)
      const primeiroDigito = parseInt(cep.charAt(0));
      
      let valoresFrete;
      
      // Região Sudeste (0-3) - São Paulo, Rio, Minas, Espírito Santo
      if (primeiroDigito >= 0 && primeiroDigito <= 3) {
        valoresFrete = [
          { prazo: '2-4 dias', valor: 12.90 },
          { prazo: '5-7 dias', valor: 9.90 }
        ];
      }
      // Região Sul (8-9) - Paraná, Santa Catarina, Rio Grande do Sul
      else if (primeiroDigito >= 8 && primeiroDigito <= 9) {
        valoresFrete = [
          { prazo: '4-6 dias', valor: 16.90 },
          { prazo: '7-10 dias', valor: 13.50 }
        ];
      }
      // Demais regiões (Nordeste, Centro-Oeste, Norte)
      else {
        valoresFrete = [
          { prazo: '6-9 dias', valor: 19.90 },
          { prazo: '10-14 dias', valor: 15.90 }
        ];
      }
      
      const freteEscolhido = valoresFrete[Math.floor(Math.random() * valoresFrete.length)];
      
      const info = {
        cep: cep.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2'),
        prazo: freteEscolhido.prazo,
        valor: freteEscolhido.valor
      };

      setFreteInfo(info);
      console.log('Frete calculado com sucesso:', info);

    } catch (err) {
      setError('Erro ao calcular frete. Tente novamente.');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCEPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Remove tudo que não for número
    const numeros = value.replace(/\D/g, '');
    
    // Limita a 8 dígitos
    const cepNumerico = numeros.slice(0, 8);
    
    setCep(cepNumerico);
    if (error) setError(null);
    if (freteInfo) setFreteInfo(null); // Limpa frete ao digitar novo CEP
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      calcularFrete();
    }
  };

  // Calcula automaticamente quando CEP tem 8 dígitos
  const handleBlur = () => {
    if (cep.replace(/\D/g, '').length === 8 && !loading && !freteInfo) {
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
          onBlur={handleBlur}
          placeholder="00000000"
          maxLength={8}
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
      
      {error && (
        <div className="error-message-compact">
          <i className="bi bi-exclamation-circle"></i>
          {error}
        </div>
      )}

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