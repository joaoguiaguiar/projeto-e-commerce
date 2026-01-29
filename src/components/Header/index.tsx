import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.scss';
import logo from '../../assets/logo.jpeg';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useFavoritos } from '../../state/context/FavoritosContext';
import { useCarrinho } from '../../state/context/CarrinhoContext';
import { useAutenticacao } from '../../state/hook/useAuth ';
import SearchBar from './Search/index';
import CarrinhoOffcanvas from '../Cart';

const Header = () => {
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
    const [mostrarCategorias, setMostrarCategorias] = useState(false);
    const [mostrarCarrinho, setMostrarCarrinho] = useState(false);
    const menuRef = useRef<HTMLLIElement>(null);
    const categoriasRef = useRef<HTMLLIElement>(null);

    const { favoritos } = useFavoritos();
    const { itensCarrinho } = useCarrinho();
    const { auth, sair } = useAutenticacao();
    const navigate = useNavigate();

    const usuarioLogado = auth?.user || null;
    const totalItensCarrinho = itensCarrinho.reduce((acc, item) => acc + item.quantidade, 0);

    useEffect(() => {
        const lidarCliqueFora = (evento: MouseEvent) => {
            const target = evento.target as Node;

            if (menuRef.current && !menuRef.current.contains(target)) {
                setMostrarMenuUsuario(false);
            }

            if (categoriasRef.current && !categoriasRef.current.contains(target)) {
                setMostrarCategorias(false);
            }
        };

        document.addEventListener('mousedown', lidarCliqueFora);
        return () => {
            document.removeEventListener('mousedown', lidarCliqueFora);
        };
    }, []);

    const handleLogin = () => {
        setMostrarMenuUsuario(false);
        navigate('/login');
    };

    const handleCadastro = () => {
        setMostrarMenuUsuario(false);
        navigate('/cadastro');
    };

    const handleLogout = () => {
        sair();
        setMostrarMenuUsuario(false);
        navigate('/');
    };

    const handleMinhaConta = () => {
        setMostrarMenuUsuario(false);
        navigate('/minha-conta');
    };

    const categoriasPrincipais = [
        {
            id: 1,
            nome: 'Áudio e Vídeo',
            icone: 'bi-headphones',
            cor: '#FF6B6B',
            path: '/categorias/audio-e-video'
        },
        {
            id: 2,
            nome: 'Cozinha',
            icone: 'bi-cup-straw',
            cor: '#4ECDC4',
            path: '/categorias/cozinha'
        },
        {
            id: 3,
            nome: 'Eletrônicos',
            icone: 'bi-cpu',
            cor: '#45B7D1',
            path: '/categorias/eletronicos'
        },
        {
            id: 4,
            nome: 'Games',
            icone: 'bi-controller',
            cor: '#96CEB4',
            path: '/categorias/games'
        },
        {
            id: 5,
            nome: 'Informática',
            icone: 'bi-laptop',
            cor: '#FFEAA7',
            path: '/categorias/informatica'
        },
        {
            id: 6,
            nome: 'Eletrodomésticos',
            icone: 'bi-plug',
            cor: '#98D8C8',
            path: '/categorias/eletrodomesticos'
        },
    ];

    return (
        <>
            <header className="cabecalho-principal">
                <Container className="container-cabecalho">
                    <div className="area-logo">
                        <Link to="/">
                            <img src={logo} alt="logo" className='logo' />
                        </Link>
                        <Link to="/" className="nome-loja-link">
                            <h1 className="nome-loja">UrbanMart</h1>
                        </Link>
                    </div>

                    <div className="area-busca">
                        <SearchBar />
                    </div>

                    <nav className="area-navegacao">
                        <ul className="lista-icones">
                            <li className="item-icone item-categorias" ref={categoriasRef}>
                                <div
                                    className="botao-categorias"
                                    onClick={() => setMostrarCategorias(!mostrarCategorias)}
                                >
                                    <i className="bi bi-grid-3x3-gap me-1"></i>
                                    <span className="texto-categorias">Categorias</span>
                                </div>

                                {mostrarCategorias && (
                                    <div className="dropdown-categorias">
                                        <div className="cabecalho-categorias">
                                            <h5 className="titulo-categorias">
                                                <i className="bi bi-grid-3x3 me-2"></i>
                                                Todas as Categorias
                                            </h5>
                                        </div>
                                        <div className="grid-categorias">
                                            {categoriasPrincipais.map(categoria => (
                                                <Link
                                                    key={categoria.id}
                                                    to={categoria.path}
                                                    className="categoria-item"
                                                    onClick={() => setMostrarCategorias(false)}
                                                >
                                                    <div
                                                        className="icone-categoria"
                                                        style={{ backgroundColor: categoria.cor + '20' }}
                                                    >
                                                        <i
                                                            className={`bi ${categoria.icone}`}
                                                            style={{ color: categoria.cor }}
                                                        ></i>
                                                    </div>
                                                    <span className="nome-categoria">{categoria.nome}</span>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="rodape-categorias">
                                            <Link
                                                to="/categorias"
                                                className="ver-todas-categorias"
                                                onClick={() => setMostrarCategorias(false)}
                                            >
                                                Ver todas as categorias →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </li>

                            {usuarioLogado ? (
                                <>
                                    <li className="item-icone item-usuario-logado" ref={menuRef}>
                                        <div 
                                            className="usuario-logado-wrapper"
                                            onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                                        >
                                            <i className="bi bi-person-fill avatar-usuario"></i>
                                            <div className="info-usuario-header">
                                                <p className="texto-ola">Olá</p>
                                                <p className="nome-usuario">{usuarioLogado.nome.split(' ')[0]}</p>
                                            </div>
                                            <i className="bi bi-chevron-down icone-dropdown"></i>
                                        </div>

                                        {mostrarMenuUsuario && (
                                            <div className="menu-usuario-logado">
                                                <div className="info-usuario">
                                                    <p className="nome-completo">Olá, {usuarioLogado.nome}!</p>
                                                </div>

                                                <div className="acoes-usuario">
                                                    <button
                                                        className="btn-acao-usuario"
                                                        onClick={handleMinhaConta}
                                                    >
                                                        <i className="bi bi-person-circle"></i>
                                                        Minha Conta
                                                    </button>

                                                    <button
                                                        className="btn-acao-usuario btn-sair"
                                                        onClick={handleLogout}
                                                    >
                                                        <i className="bi bi-box-arrow-right"></i>
                                                        Sair
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </li>

                                    <li className="item-icone">
                                        <Link to="/favoritos" className="icone-wrapper">
                                            <i className="bi bi-heart icone-nav"></i>
                                            {favoritos.length > 0 && (
                                                <span className="contador-carrinho">{favoritos.length}</span>
                                            )}
                                        </Link>
                                    </li>

                                    <li className="item-icone">
                                        <div
                                            className="icone-wrapper"
                                            onClick={() => setMostrarCarrinho(true)}
                                        >
                                            <i className="bi bi-cart icone-nav"></i>
                                            {totalItensCarrinho > 0 && (
                                                <span className="contador-carrinho">{totalItensCarrinho}</span>
                                            )}
                                        </div>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li className="item-icone item-usuario" ref={menuRef}>
                                        <div
                                            className="usuario-wrapper"
                                            onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <i className="bi bi-person icone-nav"></i>
                                            <div className="texto-usuario">
                                                <div className='container__usuarios'>
                                                    <span className="usuario-txt">Olá, faça seu login</span>
                                                    <span className="usuario-txt">ou cadastre-se</span>
                                                </div>
                                            </div>
                                        </div>

                                        {mostrarMenuUsuario && (
                                            <div className="menu-usuario">
                                                <div className="cabecalho-menu">
                                                    <p className="texto-boas-vindas">Bem-vindo</p>
                                                    <p className="texto-secundario">
                                                        Faça login ou crie uma conta para acompanhar seus pedidos e favoritos.
                                                    </p>
                                                </div>

                                                <div className="botoes-menu">
                                                    <Button
                                                        variant="outline-primary"
                                                        className="btn-azul-outline"
                                                        onClick={handleLogin}
                                                    >
                                                        <i className="bi bi-box-arrow-in-right me-2"></i>
                                                        Entrar
                                                    </Button>

                                                    <Button
                                                        variant="primary"
                                                        className="btn-azul-solid mt-2"
                                                        onClick={handleCadastro}
                                                    >
                                                        <i className="bi bi-person-plus me-2"></i>
                                                        Criar Conta
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </li>

                                    <li className="item-icone">
                                        <Link to="/favoritos" className="icone-wrapper">
                                            <i className="bi bi-heart icone-nav"></i>
                                            {favoritos.length > 0 && (
                                                <span className="contador-carrinho">{favoritos.length}</span>
                                            )}
                                        </Link>
                                    </li>

                                    <li className="item-icone">
                                        <div
                                            className="icone-wrapper"
                                            onClick={() => setMostrarCarrinho(true)}
                                        >
                                            <i className="bi bi-cart icone-nav"></i>
                                            {totalItensCarrinho > 0 && (
                                                <span className="contador-carrinho">{totalItensCarrinho}</span>
                                            )}
                                        </div>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </Container>
            </header>

            <CarrinhoOffcanvas
                mostrar={mostrarCarrinho}
                onFechar={() => setMostrarCarrinho(false)}
            />
        </>
    );
};

export default Header;