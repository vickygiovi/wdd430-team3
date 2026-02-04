import "./card.css";

const Card: React.FC = ({ product }) => {
  return (
    <div className="card1">
      <div className="card1-img" />

      <div className="card1-body">
        <p>{product.name}</p>
        <strong>${product.price.toFixed(2)}</strong>
      </div>
    </div>
  );
};

export default Card;
