import Carousel from 'react-bootstrap/Carousel';
import { Link } from 'react-router-dom';
import cozinha from '../../assets/carrossel/cozinha.png';
import eletronicos from '../../assets/carrossel/eletronicos.png';
import games from '../../assets/carrossel/games.jpeg';
import banner from '../../assets/carrossel/banner.jpeg';
import audioVideo from '../../assets/carrossel/audio&video.png';
import informatica from '../../assets/carrossel/informatica.png';
import './Carrossel.scss';

const Carrossel = () => {
  const itensCarrossel = [
    { img: eletronicos, link: '/categorias/eletronicos', alt: 'Eletrônicos' },
    { img: cozinha, link: '/categorias/cozinha', alt: 'Cozinha' },
    { img: games, link: '/categorias/games', alt: 'Games' },
    { img: audioVideo, link: '/categorias/audio-e-video', alt: 'Áudio & Vídeo' },
    { img: informatica, link: '/categorias/informatica', alt: 'Informática' }
  ];

  return (
    <div className="carrossel-container">
      <div className="banner-promocional">
        <img src={banner} alt="Banner promocional" />
      </div>

      <div className="carrossel-wrapper">
        <Carousel>
          {itensCarrossel.map((item, index) => (
            <Carousel.Item key={index}>
              <Link to={item.link}>
                <img src={item.img} alt={item.alt} />
              </Link>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>
    </div>
  );
};

export default Carrossel;