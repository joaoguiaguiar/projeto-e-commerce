import styled from "styled-components";

interface TituloProps {
  children?: React.ReactNode;
  texto?: string;
  className?: string;
  id?: string;
}

const Container = styled.div`
  width: 100%;
  max-width: 106.25rem; 
`;

const TituloContent = styled.div`
  display: inline-block;
  padding-bottom: 0.5rem; 
  border-bottom: 0.1875rem solid #0C2C55; 

  @media (max-width: 48rem) { 
    padding-bottom: 0.375rem; 
    border-bottom-width: 0.125rem; 
  }

  @media (max-width: 30rem) { 
    padding-bottom: 0.25rem;
  }
`;

const TituloTexto = styled.h4`
  font-size: 2rem; 
  text-align: start;
  color: black;
  margin: 0;
  padding: 0;

  @media (max-width: 64rem) { 
    font-size: 1.875rem; 
  }

  @media (max-width: 48rem) { 
    font-size: 1.75rem; 
  }

  @media (max-width: 30rem) { 
    font-size: 1.5rem; 
  }

  @media (max-width: 22.5rem) { 
    font-size: 1.375rem; 
  }
`;

const Titulo = ({ children, texto, className, id }: TituloProps) => {
  return (
    <Container className={className} id={id}>
      <TituloContent>
        <TituloTexto>
          {children || texto}
        </TituloTexto>
      </TituloContent>
    </Container>
  );
};

export default Titulo;