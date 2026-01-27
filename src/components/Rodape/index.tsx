import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaLinkedinIn,
  FaYoutube 
} from 'react-icons/fa';
import logo from '../../assets/logo.jpeg';
import pix from '../../assets/pagamento/logo-pix.svg';
import elo from '../../assets/pagamento/payment-elo.png';
import visa from '../../assets/pagamento/payment-visa.png';
import googlePay from '../../assets/pagamento/payment-google-pay.svg';
import hipercard from '../../assets/pagamento/payment-hipercard.png';
import './Rodape.scss';

const Rodape = () => {
  // Função para rolagem suave com tipo TypeScript
  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="rodape-container">
      <div className="conteudo-rodape">
        <div className="coluna-rodape secao-logo">
          <RouterLink to="/">
            <img src={logo} alt="UrbanMart Logo" className="logo-imagem" />
          </RouterLink>
          <RouterLink to="/" className="nome-loja-link">
            <h1 className="nome-loja">UrbanMart</h1>
          </RouterLink>
          <p className="descricao">
            Sua loja de tecnologia com os melhores produtos e ofertas exclusivas.
            Qualidade e confiança em cada compra.
          </p>
        </div>

        <div className="coluna-rodape">
          <h3 className="titulo-coluna">NAVEGAÇÃO</h3>
          <ul className="lista-navegacao">
            <li className="item-navegacao">
              <button 
                className="link-navegacao botao-navegacao"
                onClick={() => scrollToSection('home')}
              >
                Início
              </button>
            </li>
            <li className="item-navegacao">
              <button 
                className="link-navegacao botao-navegacao"
                onClick={() => scrollToSection('mais-vendidos')}
              >
                Mais Vendidos
              </button>
            </li>
            <li className="item-navegacao">
              <button 
                className="link-navegacao botao-navegacao"
                onClick={() => scrollToSection('categorias')}
              >
                Categorias
              </button>
            </li>
            <li className="item-navegacao">
              <button 
                className="link-navegacao botao-navegacao"
                onClick={() => scrollToSection('beneficios')}
              >
                Benefícios
              </button>
            </li>
          </ul>
        </div>

        <div className="coluna-rodape">
          <h3 className="titulo-coluna">FORMAS DE PAGAMENTO</h3>
          <div className="grid-pagamentos">
            <div className="item-pagamento">
              <img src={pix} alt="Pix" className="icone-pagamento" />
            </div>
            <div className="item-pagamento">
              <img src={elo} alt="Elo" className="icone-pagamento" />
            </div>
            <div className="item-pagamento">
              <img src={visa} alt="Visa" className="icone-pagamento" />
            </div>
            <div className="item-pagamento">
              <img src={googlePay} alt="Google Pay" className="icone-pagamento" />
            </div>
            <div className="item-pagamento">
              <img src={hipercard} alt="Hipercard" className="icone-pagamento" />
            </div>
          </div>
        </div>

        <div className="coluna-rodape">
          <h3 className="titulo-coluna">SIGA-NOS</h3>
          <div className="redes-sociais">
            <a 
              href="https://facebook.com" 
              className="link-social" 
              title="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebookF className="icone-social" />
            </a>
            <a 
              href="https://instagram.com" 
              className="link-social" 
              title="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram className="icone-social" />
            </a>
            <a 
              href="https://twitter.com" 
              className="link-social" 
              title="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaTwitter className="icone-social" />
            </a>
          </div>
        </div>
      </div>

      <div className="rodape-inferior">
        <p className="texto-copyright">
          © {new Date().getFullYear()} UrbanMart. Este é um projeto fictício, criado exclusivamente para fins de estudo e portfólio. Não representa uma empresa real.
        </p>
      </div>
    </footer>
  );
};

export default Rodape;