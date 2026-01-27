import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import EstilosGlobais from "./components/EstilosGlobais";
import AppRoutes from "./routes";

import { RecoilRoot } from 'recoil';
import { CarrinhoProvider } from './state/context/CarrinhoContext';
import { FavoritosProvider } from "./state/context/FavoritosContext";
import { SearchProvider } from "./state/context/SearchContext"; 

function App() {
  return (
    <RecoilRoot>
      <FavoritosProvider>
        <CarrinhoProvider>
          <SearchProvider> 
            <EstilosGlobais />
            <AppRoutes />
          </SearchProvider>
        </CarrinhoProvider>
      </FavoritosProvider>
    </RecoilRoot>
  );
}

export default App;
