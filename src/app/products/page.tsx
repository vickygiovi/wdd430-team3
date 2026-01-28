/* import Navbar from "../navigation/navbar"; */
import Sidebar from "../navigation/sidebar";
import Card from "../navigation/card";
import "./products.css";
import "../index.css";
/* import Footer from "../navigation/footer"; */

export default function ProductsPage() {
  return (
    <>
      {/* <Navbar /> */}

      <main className="products-layout">
        <Sidebar />

        <section className="products-content">
          <div className="products-toolbar">
            <div className="search">Search</div>

            <div className="filters">
              <button className="active">New</button>
              <button>Price ascending</button>
              <button>Price descending</button>
              <button>Rating</button>
            </div>
          </div>

          <div className="products-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} />
            ))}
          </div>
        </section>
      </main>

     {/*  <Footer /> */}
    </>
  );
}
