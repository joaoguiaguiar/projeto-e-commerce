import { Link } from 'react-router-dom';
import './TagsCategorias.scss';

const TagsCategorias = () => {
    const categorias = [
        {
            name: 'Eletrônicos',
            path: '/categorias/eletronicos',
            image: '/IMG/eletronicos/camera.webp'
        },
        {
            name: 'Informática',
            path: '/categorias/informatica',
            image: '/IMG/informatica/rtx3060.webp'
        },
        {
            name: 'Cozinha',
            path: '/categorias/cozinha',
            image: '/IMG/cozinha/cafeteira.webp'
        },
        {
            name: 'Áudio',
            path: '/categorias/audio-e-video',
            image: '/IMG/audio-e-video/caixasomjbl.webp'
        },
        {
            name: 'Games',
            path: '/categorias/games',
            image: '/IMG/games/xboxseriesx.webp'
        },
        {
            name: 'Eletrodomésticos',
            path: '/categorias/eletrodomesticos',
            image: '/IMG/eletrodomesticos/geladeiraRefregirador.webp'
        },
    ];

    return (
        <section className="secao-tags">
            <div className="grade-categorias">
                {categorias.map(categoria => (
                    <Link 
                        to={categoria.path} 
                        key={categoria.name}
                        className="card-categoria"
                    >
                        <div className="container-imagem">
                            <img
                                src={categoria.image}
                                alt={categoria.name}
                                className="imagem-categoria"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const container = target.parentElement;
                                    if (container) {
                                        container.innerHTML = `
                                            <div class="fallback-imagem">
                                                ${categoria.name}
                                            </div>
                                        `;
                                    }
                                }}
                            />
                        </div>
                        <span className="nome-categoria">{categoria.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TagsCategorias;