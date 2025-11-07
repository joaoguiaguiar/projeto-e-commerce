import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import EstilosGlobais from "./components/EstilosGlobais";
import AppRoutes from "./routes";
import { RecoilRoot } from 'recoil';
import { CarrinhoProvider } from './state/context/CarrinhoContext';

function App() {
  return (
    <>
      <RecoilRoot>
        <CarrinhoProvider>
          <EstilosGlobais />
          <AppRoutes />
        </CarrinhoProvider>
      </RecoilRoot>
    </>
  );
}

export default App;  