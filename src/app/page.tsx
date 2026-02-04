import Image from "next/image";
import "./index.css";
import { Twitter, Instagram, Youtube, Linkedin } from 'lucide-react';
import Link from 'next/link';

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
          HERO
      ========================== */}
      <section className="hero">
        <h1>Handcrafted Haven</h1>
        <p>A curated marketplace for artisans and creators</p>

        <div className="hero-actions">
          <Link
            href="/catalog"
          >
            <button className="btn btn-primary">Browse Catalog</button>
          </Link>
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

      
    </>    
  );
}
