import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "../pages/Home";
import PaginaBase from "../pages/PaginaBase";
import AreaLogada from "../pages/AreaLogada";
import Categoria from "../pages/Categoria";
import ProductDetails from "../pages/ProductDetails";
import Favoritos from "../pages/Favoritos";
import Login from "../pages/Form/login";
import Cadastro from "../pages/Form/Cadastro";
import SeusDados from "../pages/AreaLogada/Dados";
import Pedidos from "../pages/AreaLogada/Pedidos";
import BuscaResultados from "../pages/Busca";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PaginaBase />}>
          <Route index element={<HomePage />} />
          <Route path="categorias" element={<Categoria />} />
          <Route path="categorias/:categoriaId" element={<Categoria />} />
          <Route path="/favoritos" element={<Favoritos />} />
          <Route path="produto/:id" element={<ProductDetails />} />

          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route path="/busca" element={<BuscaResultados />} />

          <Route path='/minha-conta' element={<AreaLogada />}>
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="dados" element={<SeusDados />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
