import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import './Newsletter.scss';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = () => {
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }

    setStatus('loading');
    
    // Simulando envio
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <section className="secao-newsletter">
      <div className="container-newsletter">
        <div className="cabecalho-newsletter">
          <div className="icone-newsletter">
            <div className="envoltorio-icone">
              <Mail size={32} />
            </div>
          </div>
          
          <h2 className="titulo-newsletter">Fique por dentro das novidades!</h2>
          <p className="descricao-newsletter">
            Receba em primeira mão nossas ofertas exclusivas, lançamentos e cupons de desconto
          </p>
        </div>

        <div className="container-formulario">
          <div className="formulario-newsletter">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite seu melhor e-mail"
              disabled={status === 'loading'}
              className="input-email"
            />
            
            <button
              onClick={handleSubmit}
              disabled={status === 'loading'}
              className={`botao-inscricao ${status === 'loading' ? 'botao-carregando' : ''}`}
            >
              {status === 'loading' ? (
                <>
                  <div className="spinner-carregamento"></div>
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Cadastrar
                </>
              )}
            </button>
          </div>

          {status === 'success' && (
            <div className="mensagem-feedback mensagem-sucesso">
              ✓ Cadastro realizado com sucesso! Verifique seu e-mail.
            </div>
          )}

          {status === 'error' && (
            <div className="mensagem-feedback mensagem-erro">
              ⚠ Por favor, insira um e-mail válido.
            </div>
          )}
        </div>

        <p className="texto-privacidade">
          🔒 Seus dados estão seguros. Não compartilhamos com terceiros.
        </p>

        <div className="estatisticas-newsletter">
          <div className="item-estatistica">
            <div className="valor-estatistica">15%</div>
            <div className="rotulo-estatistica">de desconto na primeira compra</div>
          </div>
          
          <div className="item-estatistica">
            <div className="valor-estatistica">+50mil</div>
            <div className="rotulo-estatistica">assinantes já cadastrados</div>
          </div>
          
          <div className="item-estatistica">
            <div className="valor-estatistica">Ofertas</div>
            <div className="rotulo-estatistica">exclusivas semanais</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Newsletter;