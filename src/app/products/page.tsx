import Image from "next/image";
import { Plus } from "lucide-react";
import Link from "next/link";
import { fetchProductsByArtesano } from "../lib/products-data";
import './productimages.css';

export default async function Page() {

  const products = await fetchProductsByArtesano('a239e0e7-70d2-47f9-83f7-d0a7e33e5850');

  const productsMock = [
    {
      id: 1,
      name: "Hand-Thrown Ceramic Mug",
      description:
        "A rustic, speckled stoneware mug with a deep blue glaze, perfect for cozy mornings.",
      price: 32.0,
      image: "/product_placeholder.jpg",
    },
    {
      id: 2,
      name: "Macramé Wall Hanging",
      description:
        "Intricate boho-style wall art hand-knotted with 100% natural cotton cord on driftwood.",
      price: 55.5,
      image: "/product_placeholder.jpg",
    },
    {
      id: 3,
      name: "Leather Bound Journal",
      description:
        "Genuine leather cover with hand-stitched binding and 200 pages of recycled deckle-edge paper.",
      price: 45.0,
      image: "/product_placeholder.jpg",
    },
    {
      id: 4,
      name: "Soy Wax Scented Candle",
      description:
        "Hand-poured in a glass jar with notes of lavender, sandalwood, and dried botanicals.",
      price: 18.99,
      image: "/product_placeholder.jpg",
    },
    {
      id: 5,
      name: "Embroidery Starter Kit",
      description:
        "Includes a wooden hoop, colored threads, needles, and a pre-printed floral pattern on linen.",
      price: 24.0,
      image: "/product_placeholder.jpg",
    },
    {
      id: 6,
      name: "Hand-Woven Willow Basket",
      description:
        "Traditional wicker basket crafted from organic willow, ideal for picnics or storage.",
      price: 68.0,
      image: "/product_placeholder.jpg",
    },
    {
      id: 7,
      name: "Artisan Watercolor Set",
      description:
        "A palette of 12 professional-grade, highly pigmented paints made from natural minerals.",
      price: 42.5,
      image: "/product_placeholder.jpg",
    },
    {
      id: 8,
      name: "Knitted Wool Beanie",
      description:
        "Ultra-soft alpaca wool hat, hand-knitted in a classic cable pattern for extra warmth.",
      price: 38.0,
      image: "/product_placeholder.jpg",
    },
    {
      id: 9,
      name: "Copper Wire Wrapped Pendant",
      description:
        "Unique necklace featuring a raw amethyst crystal wrapped in oxidized copper wire.",
      price: 29.95,
      image: "/product_placeholder.jpg",
    },
  ];

  return (
    <>
      <section className="add-product">
        <h1 className="text-3xl font-bold">My Products</h1>
        <Link
          href="/products/create"
        >
          <button className="btn btn-newproduct">Add New Product</button>
        </Link>
      </section>
      <section className="catalog container mx-auto">
        {products.map((product) => (
          <article
            key={product.id}
            className="card group flex flex-col items-center text-center p-5 bg-white border border-gray-100"
          >
            {/* Contenedor de imagen con efecto de escala */}
            <div className="overflow-hidden rounded-md mb-4 bg-gray-50">
              <Image
                src={product.imagen_principal_url}
                alt={product.nombre}
                width={250}
                height={250}
                className="object-cover transition-transform duration-300 group-hover:scale-110 imagen"
              />
            </div>

            {/* Título: ahora sí se verá grande */}
            <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
              {product.nombre}
            </h3>

            {/* Precio con un estilo más artesanal */}
            <p className="text-emerald-700 font-semibold text-lg">
              ${Number(product.precio).toFixed(2)}
            </p>

            {/* Botón opcional para mejorar el CTA */}

            {/* <Link
              href={`/products/${product.id}/edit`}
              className="mt-4 w-full py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              <button>
                Edit Product
              </button>
            </Link>
            <Link
              href={`/products/${product.id}/edit`}
              className="mt-4 w-full py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors"
            >
              <button>
                Delete Product
              </button>
            </Link> */}

            <div className="flex gap-2 mt-4 w-full"> 
              <Link
                href={`/products/${product.id}/edit`}
                className="flex-1 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors text-center"
              >
                Edit Product
              </Link>
              
              <Link
                href={`/products/${product.id}/delete`} // O la ruta que maneje el borrado
                className="flex-1 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors text-center btn-products"
              >
                Delete Product
              </Link>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}