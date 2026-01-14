import "./index.css";

function App() {
  return (
    <>
      {/* =========================
          HEADER / NAVBAR
      ========================== */}
      <header>
        <nav className="navbar">
          <div className="logo">⨯</div>

          <ul>
            <li><a href="#">Products</a></li>
            <li><a href="#">Solutions</a></li>
            <li><a href="#">Community</a></li>
            <li><a href="#">Resources</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">Contact</a></li>
          </ul>

          <div className="nav-actions">
            <button className="btn btn-outline">Sign in</button>
            <button className="btn btn-solid">Register</button>
          </div>
        </nav>
      </header>

      {/* =========================
          HERO
      ========================== */}
      <section className="hero">
        <h1>Artisans</h1>
        <p>Subtitle</p>

        <div className="hero-actions">
          <button className="btn btn-primary">Button</button>
          <button className="btn btn-secondary">Button</button>
        </div>
      </section>

      {/* =========================
          FEATURE
      ========================== */}
      <section className="feature">
        <div className="feature-placeholder"></div>
      </section>

      {/* =========================
          TESTIMONIALS
      ========================== */}
      <section className="testimonials">
        <div className="testimonials-header">
          <h2>Heading</h2>
          <p>Subheading</p>
        </div>

        <div className="testimonial-grid">
          {[1,2,3,4,5,6,7,8,9,10].map((item) => (
            <article className="testimonial-card" key={item}>
              <blockquote>“Quote”</blockquote>

              <div className="testimonial-user">
                <div className="avatar"></div>
                <div className="user-info">
                  <strong>Title</strong>
                  <small>Description</small>
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
            <div className="logo">⨯</div>
            <div className="footer-social">
              <span>X</span>
              <span>📷</span>
              <span>▶</span>
              <span>in</span>
            </div>
          </div>

          <div className="footer-column">
            <h4>Use cases</h4>
            <ul>
              <li><a href="#">UI design</a></li>
              <li><a href="#">UX design</a></li>
              <li><a href="#">Wireframing</a></li>
              <li><a href="#">Diagramming</a></li>
              <li><a href="#">Brainstorming</a></li>
              <li><a href="#">Online whiteboard</a></li>
              <li><a href="#">Team collaboration</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Explore</h4>
            <ul>
              <li><a href="#">Design</a></li>
              <li><a href="#">Prototyping</a></li>
              <li><a href="#">Development features</a></li>
              <li><a href="#">Design systems</a></li>
              <li><a href="#">Collaboration features</a></li>
              <li><a href="#">Design process</a></li>
              <li><a href="#">FigJam</a></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <ul>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Best practices</a></li>
              <li><a href="#">Colors</a></li>
              <li><a href="#">Color wheel</a></li>
              <li><a href="#">Support</a></li>
              <li><a href="#">Developers</a></li>
              <li><a href="#">Resource library</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
