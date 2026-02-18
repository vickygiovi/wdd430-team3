import Link from "next/link";
import '../productdetails.css';
import "../../index.css";
import { fetchProductById } from "@/app/lib/products-data";
import Image from "next/image";
import { Product } from "@/app/lib/products-data";
import { fetchProductReviewsByProductId } from "@/app/lib/review-data";
import Form from "@/app/ui/reviews/create-form";

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

  const reviews = await fetchProductReviewsByProductId(id);

  const userId = "ddf3e87c-f0e8-4111-be48-06a9d815c212"

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
            <p>
              <strong>Color:</strong> {product.color || "N/A"}
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
        {/* SECCIÓN DE RATINGS Y COMENTARIOS */}
      
      </div>

      <div className="reviews-section">
        <h2 className="reviews-title">Opiniones de clientes</h2>
        
        {/* Resumen de estrellas (opcional) */}
        <div className="reviews-summary">
          <span className="average-rating">
            {reviews.length > 0 
              ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
              : 0} ⭐
          </span>
          <span className="total-reviews">({reviews.length} comentarios)</span>
        </div>

        <div className="add-review-form">
          <h3>Deja tu opinión</h3>
          <Form productId={id} userId={userId} />
        </div>

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <span className="review-stars">{"⭐".repeat(review.rating)}</span>
                  <span className="review-date">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="review-comment">{review.comment || "Sin comentario escrito."}</p>
                <p className="review-user">Por Usuario: {review.user_id.split('-')[0]}</p>
              </div>
              
            ))
          ) : (
            <p className="no-reviews">Este producto aún no tiene reseñas. ¡Sé el primero!</p>
          )}
        </div>
      </div>
      
    </section>
  );
}
