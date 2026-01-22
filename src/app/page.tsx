import Image from "next/image";
import "./index.css";
import { Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';

const testimonialData = [
  {
    index: 1,
    quote: "This marketplace has transformed the way I connect with artisans worldwide. The quality and authenticity of the products are unmatched.",
    title: "Artisan Connection",
    description: "Global Marketplace"
  },
  {
    index: 2,
    quote: "I've found unique pieces that reflect my personal style and values.",
    title: "Unique Finds",
    description: "Personal Style"
  },
  {
    index: 3,
    quote: "The customer service is exceptional, and the delivery process is seamless.",
    title: "Exceptional Service",
    description: "Customer Experience"
  },
  {
    index: 4,
    quote: "This marketplace has transformed the way I connect with artisans worldwide. The quality and authenticity of the products are unmatched.",
    title: "Artisan Connection",
    description: "Global Marketplace"
  },
  {
    index: 5,
    quote: "I've found unique pieces that reflect my personal style and values.",
    title: "Unique Finds",
    description: "Personal Style"
  },
  {
    index: 6,
    quote: "The customer service is exceptional, and the delivery process is seamless.",
    title: "Exceptional Service",
    description: "Customer Experience"
  },
  {
    index: 7,
    quote: "This marketplace has transformed the way I connect with artisans worldwide. The quality and authenticity of the products are unmatched.",
    title: "Artisan Connection",
    description: "Global Marketplace"
  },
  {
    index: 8,
    quote: "I've found unique pieces that reflect my personal style and values.",
    title: "Unique Finds",
    description: "Personal Style"
  },
  {
    index: 9,
    quote: "The customer service is exceptional, and the delivery process is seamless.",
    title: "Exceptional Service",
    description: "Customer Experience"
  },
  {
    index: 10,
    quote: "The customer service is exceptional, and the delivery process is seamless.",
    title: "Exceptional Service",
    description: "Customer Experience"
  }
];

export default function Home() {
  return (
     <>
      {/* =========================
          HEADER / NAVBAR
      ========================== */}
      <header>
        <nav className="navbar">
          <div className="logo">
            <Image src="/logo2.png" alt="Logo" width={50} height={50} />
          </div>

          <ul>
            <li><a href="#">Browse Catalog</a></li>
            <li><a href="#">My Ratings</a></li>
            <li><a href="#">My Written Reviews</a></li>
            <li><a href="#">Contact</a></li>
          </ul>

          <div className="nav-actions">
            <button className="btn btn-outline">Sign in</button>
            <button className="btn btn-solid">Register</button>
            <button className="btn btn-profile">My Profile</button>
            <button className="btn btn-stories">My Stories</button>
            <button className="btn btn-products">My Products</button>
          </div>
        </nav>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section className="hero">
        <h1>Handcrafted Haven</h1>
        <p>A curated marketplace for artisans and creators</p>

        <div className="hero-actions">
          <button className="btn btn-primary">Browse Catalog</button>
          <button className="btn btn-secondary">Contact Us</button>
        </div>
      </section>

      {/* =========================
          FEATURE
      ========================== */}
      <section className="feature">
        <div className="feature-grid">
          <div className="feature-item">
            <span className="feature-icon">🌿</span>
            <h3>Sustainably Sourced</h3>
            <p>Materials that respect the environment and local traditions.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔨</span>
            <h3>Expertly Crafted</h3>
            <p>Every piece is handmade by artisans with decades of experience.</p>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📦</span>
            <h3>Worldwide Shipping</h3>
            <p>Bringing authentic craftsmanship from our workshop to your door.</p>
          </div>
        </div>
      </section>

      {/* =========================
          TESTIMONIALS
      ========================== */}
      <section className="testimonials">
        <div className="testimonials-header">
          <h2>Our Testimonials</h2>
          <p>See what people are saying</p>
        </div>

        <div className="testimonial-grid">
          {testimonialData.map((item) => (
            <article className="testimonial-card" key={item.index}>
              <blockquote>“{item.quote}”</blockquote>

              <div className="testimonial-user">
                <div className="avatar"></div>
                <div className="user-info">
                  <strong>{item.title}</strong>
                  <small>{item.description}</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================
          FOOTER
      ========================== */}
      <footer>
        <div className="footer-container">
          <div>
            <div className="logo">
              <Image src="/logo2.png" alt="Logo" width={50} height={50} />
            </div>
            <div className="footer-social">
              <a href="#" aria-label="Twitter">
                <Twitter size={20} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram size={20} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="YouTube">
                <Youtube size={20} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="LinkedIn">
                <Linkedin size={20} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Artisans</h4>
            <ul>
              <li><a href="#">View Profile</a></li>
              <li><a href="#">Modify Profile</a></li>
              <li><a href="#">Publish a Crafting</a></li>
              <li><a href="#">Tell a Story</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Users</h4>
            <ul>
              <li><a href="#">Start Browsing</a></li>
              <li><a href="#">Filtering</a></li>
              <li><a href="#">Ratings</a></li>
              <li><a href="#">User Reviews</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>About Us</h4>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>    
  );
}
