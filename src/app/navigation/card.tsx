import Link from 'next/link';

type CardProps = {
  id: string;
  name: string;
  price: number;
  description: string;
};

const Card: React.FC<CardProps> = ({ id, name, price, description }) => {
  return (
    <Link href={`/products/${id}`} className="card1">
      <div className="card1-img" />

      <div className="card1-body">
        <p>{name}</p>
        <small>{description}</small>
        <strong>${price}</strong>
      </div>
    </Link>
  );
};

export default Card;
