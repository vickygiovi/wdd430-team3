import Link from "next/link";
import "../products.css";
import "../../index.css";
import { fetchProductById } from "@/app/lib/products-data";
import Image from "next/image";
import { Product } from "@/app/lib/products-data";

// type Product = {
//   id: string;
//   name: string;
//   price: number;
//   description: string;
// };

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const product = await fetchProductById(id);

  // Inicializamos el estado directamente con una función
  // const [product] = useState<Product | null>(() => {
  //   // Verificamos que estemos en el navegador y que tengamos un ID
  //   if (typeof window === 'undefined' || !id) return null;

  //   const stored = localStorage.getItem('products');
  //   if (!stored) return null;

  //   try {
  //     const products: Product[] = JSON.parse(stored);
  //     return products.find((p) => p.id === id) || null;
  //   } catch (error) {
  //     console.error("Error parseando productos:", error);
  //     return null;
  //   }
  // });

  if (!product) {
    return (
      <div style={{ padding: "2rem" }}>
        <h1>Producto no encontrado</h1>
        <Link href="/products">← Volver a productos</Link>
      </div>
    );
  }

  return (
    <section className="details-container">
      <div className="details-card">
        {/* Columna Izquierda: Imágenes */}
        <div className="details-image">
          <div className="main-image-wrapper">
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>

          <div className="gallery-container">
            {product.imagenes_galeria?.map((image: string) => (
              <div key={image} className="gallery-item">
                <Image
                  src={image}
                  alt="Gallery"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Columna Derecha: Info */}
        <div className="details-info">
          <h1>{product.name}</h1>
          <p className="price-tag">${product.price}</p>

          <div className="specs">
            <p>
              <strong>Descripción:</strong> {product.description}
            </p>
            <p>
              <strong>Artesano:</strong> {product.artisan_name}
            </p>
            <p>
              <strong>Categoría:</strong> {product.category_name}
            </p>
            <p>
              <strong>Stock:</strong> {product.stock} unidades
            </p>
            <p>
              <strong>Size:</strong> {product.size || "N/A"}
            </p>
          </div>

          <div className="keywords-section">
            <strong>Keywords:</strong>
            <br />
            {product.keywords?.length > 0
              ? product.keywords.map((k: string) => (
                  <span key={k} className="keyword-badge">
                    {k}
                  </span>
                ))
              : "N/A"}
          </div>

          <div className="button-group">
            <Link href="/#">
              <button className="create-button">Comprar ahora</button>
            </Link>
            <Link href="/catalog">
              <button className="create-button">← Volver a productos</button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
