export default function ProductDetailsPage() {
  return (
    <>
      {/* Columna izquierda */}
      <div className="details-image">
        <div className="image-placeholder">Imagen del producto</div>
      </div>

      {/* Columna derecha */}
      <div className="details-info">
        <h1>Text Heading</h1>
        <span className="tag">Tag</span>
        <h2>$50</h2>

        <p className="details-description">
          Descripción del producto aquí. Información clara y bien separada.
        </p>

        <button className="create-button">Comprar</button>
      </div>
    </>
  );
}
