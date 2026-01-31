type CardProps = {
  name: string;
  price: number;
  description: string;
};

const Card: React.FC<CardProps> = ({ name, price, description }) => {
  return (
    <div className="card1">
      <div className="card1-img" />

      <div className="card1-body">
        <p>{name}</p>
        <small>{description}</small>
        <strong>${price}</strong>
      </div>
    </div>
  );
};

export default Card;
