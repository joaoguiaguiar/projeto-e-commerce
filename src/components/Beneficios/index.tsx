import './Beneficios.scss';

const Beneficios = ({ id }: { id?: string }) => {
  const beneficios = [
    {
      icone: '🚚',
      titulo: 'Frete Grátis',
      descricao: 'Em compras acima de R$ 199 para todo Brasil'
    },
    {
      icone: '🔒',
      titulo: 'Compra Segura',
      descricao: 'Seus dados protegidos com criptografia SSL'
    },
    {
      icone: '💳',
      titulo: 'Parcele em até 12x',
      descricao: 'Cartão de crédito com juros baixos'
    },
    {
      icone: '↩️',
      titulo: 'Troca Fácil',
      descricao: 'Até 30 dias para trocar seu produto'
    }
  ];

  return (
    <section className="beneficios">
      <div className="beneficios__container">
        <div className="beneficios__grid">
          {beneficios.map((beneficio, index) => (
            <div className="beneficios__item" key={index}>
              <div className="beneficios__icone">{beneficio.icone}</div>
              <h3 className="beneficios__titulo">{beneficio.titulo}</h3>
              <p className="beneficios__descricao">{beneficio.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Beneficios;