import { useEffect } from "react";
import styled from "styled-components";
import Titulo from "../../components/Titulo";
import maisVendidos from "../../data/json/maisVendidos.json";
import TagsCategorias from "../../components/TagsCategorias";
import Newsletter from "../../components/Newsletter";
import Card from "../../components/Card";
import Carrossel from "../../components/Carrossel";
import Beneficios from "../../components/Beneficios";

const BlocoEstilizado = styled.div`
  background-color: #0C2C55;
  height: 90px;
  
  @media (max-width: 768px) {
    height: 60px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: min(1700px, 95vw);
  margin: 0 auto;
  gap: 2rem;
  padding: 40px 20px;
  
  @media (max-width: 1200px) {
    max-width: 95vw;
    padding: 30px 15px;
  }
  
  @media (max-width: 768px) {
    padding: 20px 10px;
    gap: 1.5rem;
  }
`;

const ContainerCard = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 10px 0 15px;

  &::-webkit-scrollbar {
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    overflow-x: visible;
  }
`;

const TituloCentralizadoContainer = styled.div`
  width: 100%;
  text-align: center;
  
  @media (max-width: 768px) {
    text-align: center;
  }
`;

const HomePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 10);
  }, []);

  return (
    <section id="home">
      <Carrossel />

      <Container id="mais-vendidos">
        <TituloCentralizadoContainer>
          <Titulo texto="Mais Vendidos" />
        </TituloCentralizadoContainer>

        <ContainerCard>
          <Card produtos={maisVendidos} />
        </ContainerCard>
      </Container>

      <BlocoEstilizado />

      <Container id="categorias">
        <div style={{ width: "100%", textAlign: "center" }}>
          <Titulo texto="Categorias Mais Buscadas" />
        </div>

        <TagsCategorias />
      </Container>

      <Newsletter />
      <Beneficios id="beneficios" />
    </section>
  );
};

export default HomePage;