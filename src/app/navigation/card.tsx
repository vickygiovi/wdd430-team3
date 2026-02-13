import "./card.css";
import { Product } from "../lib/products-data";
import Image from "next/image";
import Link from 'next/link';

const Card = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.id}`}>
      <div className="card1">
      <div className="card1-img">
        <div style={{ position: 'relative', width: '100%', height: '170px' }}>
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }} // Para que no se deforme
            sizes="(max-width: 768px) 100vw, 50vw"
            className="image_product"
          />
        </div>
      </div>

      <div className="card1-body">
        <p>{product.name}</p>
        <strong>${product.price.toFixed(2)}</strong>
      </div>
    </div>
    </Link>
  );
};

export default Card;
