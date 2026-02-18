/* import Navbar from "../navigation/navbar"; */
import Sidebar from "../navigation/sidebar";
import Card from "../navigation/card";
import Filters from "./filters/filters";
import "./products.css";
import "../index.css";
import { fetchFilteredProducts, fetchProducts } from "../lib/products-data";
import SearchInput from "../ui/search";
import { Category, fetchCategories } from "../lib/category-data";
/* import Footer from "../navigation/footer"; */

// const products = await fetchProducts();
const categories: Category[] = await fetchCategories();

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

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    sortBy?: string;
    maxPrice?: string;
    minPrice?: string;
    color?: string;
    categories?: string;
    keyword?: string,
    size?: string,

    // ... otros filtros
  };
}) {
  const sParams = await searchParams;

  const query = sParams?.query || '';
  const sortBy = sParams?.sortBy || 'date';
  const maxPrice = Number(sParams?.maxPrice) || undefined;
  const minPrice = Number(sParams?.minPrice) || undefined;
  const color = sParams?.color || undefined;
  const categoriesArray = sParams?.categories?.split(',').filter(Boolean) || [];
  
  // 1. Obtenemos el valor o un string vacío si es undefined/null
  const keywordString = sParams?.keyword || "";

  // 2. Ahora TypeScript sabe que keywordString es SIEMPRE un string
  const keywordArray = keywordString.split(',').filter(Boolean);

  const size = sParams?.size || undefined;

  // categoryIds,
  // minPrice,
  // maxPrice,
  // keyword,
  // size,
  // color,
  // sortBy

  const products = await fetchFilteredProducts({
    categoryIds: categoriesArray,
    minPrice: minPrice,
    maxPrice: maxPrice,
    keyword: keywordString,
    size: size,
    color: color,
    sortBy: sortBy,
    searchName: query
  });

  return (
    <>
      {/* <Navbar /> */}

      <main className="products-layout">
        <Sidebar categories={categories}/>

        <section className="products-content">
          <div className="products-toolbar">
            <div className="search-bar">
              <SearchInput placeholder="Search products..."/>
            </div>
            <Filters />
            
          </div>

          <div className="products-grid">
            {products.map((product) => (
              <Card key={product.id} product={product} />
            ))}
          </div>
        </section>
      </main>

     {/*  <Footer /> */}
    </>
  );
}
