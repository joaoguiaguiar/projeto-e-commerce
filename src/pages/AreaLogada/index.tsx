import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { User, Package, LogOut, ShoppingBag, TrendingUp } from 'lucide-react';
import './AreaLogada.scss';

// Simulação do usuário logado
const getUserFromStorage = () => {
  const userToken = localStorage.getItem('user_token');
  const usersStorage = localStorage.getItem('users_bd');

  if (userToken && usersStorage) {
    const userInfo = JSON.parse(userToken);
    const users = JSON.parse(usersStorage);
    return users.find((user: any) => user.email === userInfo.email);
  }
  return null;
};

const AreaLogada = () => {
  const [usuario, setUsuario] = useState<any>(null);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, [location.pathname]); 

  useEffect(() => {
    const user = getUserFromStorage();
    if (!user) {
      navigate('/login');
      return;
    }
    setUsuario(user);

    // Carrega pedidos
    const pedidosSalvos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    setPedidos(pedidosSalvos);
  }, [navigate]);

  const handleLogout = () => {
    // Remove o token de autenticação
    localStorage.removeItem('user_token');

    // REDIRECIONA para a página inicial e FORÇA RELOAD
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  // Calcula estatísticas
  const totalPedidos = pedidos.length;
  const totalGasto = pedidos.reduce((acc, pedido) => {
    const totalPedido = pedido.produtos.reduce(
      (sum: number, item: any) => sum + (item.preco * item.quantidade),
      0
    );
    return acc + totalPedido;
  }, 0);

  const formatador = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <>
      <div className="AreaLogada__header-container">
        <div className="AreaLogada__titulo-wrapper">
          <h1 className="AreaLogada__titulo">Minha Conta</h1>
          {usuario && (
            <p className="AreaLogada__subtitulo">Bem-vindo(a), {usuario.nome}!</p>
          )}
        </div>
      </div>

      <section className="AreaLogada">
        <div className="AreaLogada__menu AreaLogada__menu--moderno">
          <div className="AreaLogada__stats-grid">
            <div className="AreaLogada__stat-card AreaLogada__stat-card--primaria">
              <div className="AreaLogada__stat-header">
                <div className="AreaLogada__stat-icon">
                  <ShoppingBag />
                </div>
                <span className="AreaLogada__stat-label">Total de Pedidos</span>
              </div>
              <div className="AreaLogada__stat-value">{totalPedidos}</div>
            </div>

            <div className="AreaLogada__stat-card AreaLogada__stat-card--sucesso">
              <div className="AreaLogada__stat-header">
                <div className="AreaLogada__stat-icon">
                  <TrendingUp />
                </div>
                <span className="AreaLogada__stat-label">Total Gasto</span>
              </div>
              <div className="AreaLogada__stat-value">{formatador.format(totalGasto)}</div>
            </div>
          </div>

          <div className="AreaLogada__divisor" />
          <nav className="AreaLogada__navegacao-wrapper">
            <ul className="AreaLogada__navegacao">
              <li className="AreaLogada__item">
                <Link
                  to="/minha-conta/pedidos"
                  className={`AreaLogada__link ${
                    isActive('/minha-conta/pedidos') ? 'AreaLogada__link--ativo' : ''
                  }`}
                >
                  <Package className="AreaLogada__link-icon" />
                  <span className="AreaLogada__link-text">Meus Pedidos</span>
                </Link>
              </li>
              <li className="AreaLogada__item">
                <Link
                  to="/minha-conta/dados"
                  className={`AreaLogada__link ${
                    isActive('/minha-conta/dados') ? 'AreaLogada__link--ativo' : ''
                  }`}
                >
                  <User className="AreaLogada__link-icon" />
                  <span className="AreaLogada__link-text">Meus Dados</span>
                </Link>
              </li>
            </ul>
          </nav>

          <button
            className="AreaLogada__botao-logout"
            onClick={handleLogout}
            type="button"
          >
            <LogOut className="AreaLogada__logout-icon" />
            <span className="AreaLogada__logout-text">Sair da conta</span>
          </button>
        </div>

        <div className="AreaLogada__conteudo">
          <Outlet />
        </div>
      </section>
    </>
  );
};

export default AreaLogada;