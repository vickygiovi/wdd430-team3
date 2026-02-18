import Link from "next/link";
import Image from "next/image";
import { Article } from "../lib/definitions";
import { fetchStoriesByArtesano } from "../lib/stories-data";
import { auth } from '@/auth';

export default async function Page() {
  const session = await auth();

  // 2. Verificamos que el usuario esté logueado
  if (!session || !session.user || !session.user.id) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 font-bold">
          No autorizado. Debes iniciar sesión para realizar esta acción.
        </p>
      </div>
    );
  }
  
  const articles: Article[] = await fetchStoriesByArtesano(
    session.user.id,
  );

  const styles = {
    // ... tus otros estilos
    tagDestacado: {
      backgroundColor: "#f59e0b", // El color ámbar-500
      color: "black",
      // PADDING: 4px arriba/abajo, 12px izquierda/derecha
      padding: "4px 12px",
      borderRadius: "9999px", // Redondeado completo
      fontSize: "12px", // text-xs
      fontWeight: "bold", // font-bold
      textTransform: "uppercase" as const,
      marginBottom: "16px", // mb-4
      display: "inline-block", // Necesario para que respete el margin y padding
      letterSpacing: "0.05em", // Un toque de tracking para que se lea mejor
    },
    contenido: {
      color: "#e5e7eb", // text-gray-200
      fontSize: "1.125rem", // text-lg (18px)
      fontWeight: 300, // font-light
      lineHeight: "1.6", // mayor legibilidad
      marginBottom: "24px", // mb-6
      maxWidth: "672px", // max-w-2xl
      textAlign: "left" as const,
      // Las siguientes 4 líneas simulan el "line-clamp-2" en CSS puro:
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical" as const,
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    autorFlexContainer: {
      display: "flex",
      alignItems: "center",
      gap: "16px", // Espacio entre el avatar y el texto (gap-4)
      marginBottom: "24px", // Espacio respecto al botón (mb-6)
      padding: "4px 0", // Un pequeño padding vertical para equilibrio
    },
    avatarWrapper: {
      position: "relative" as const,
      width: "44px", // w-11 (ligeramente más grande que w-10)
      height: "44px",
      borderRadius: "50%",
      overflow: "hidden",
      border: "2px solid #f59e0b", // Borde ámbar para resaltar la foto
      flexShrink: 0, // Evita que la foto se aplaste si el texto es largo
    },
    textoAutorContainer: {
      display: "flex",
      flexDirection: "column" as const,
      justifyContent: "center",
      lineHeight: "1.2",
    },
    nombreAutor: {
      color: "white",
      fontWeight: "600", // font-semibold
      fontSize: "15px",
      margin: 0, // Quitamos márgenes por defecto de <p>
    },
    fechaAutor: {
      color: "white",
      opacity: 0.7, // opacity-70
      fontSize: "13px", // text-sm
      margin: 0,
      marginTop: "2px",
    },
    botonLeerHistoria: {
      display: "inline-block", // Permite que el padding afecte al tamaño
      backgroundColor: "white", // Fondo blanco original
      color: "black", // Texto negro
      padding: "12px 32px", // py-3 (12px) y px-8 (32px)
      borderRadius: "8px", // rounded-lg
      fontWeight: "700", // font-bold
      textTransform: "uppercase" as const, // uppercase
      fontSize: "14px", // text-sm
      letterSpacing: "0.025em", // tracking-wider
      textDecoration: "none", // Quita el subrayado del link
      transition: "background-color 0.2s ease, color 0.2s ease", // Suaviza el cambio de color
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", // Sombra ligera para dar relieve
    },
    exploraContenedor: {
      padding: "80px 80px 40px 80px", // Alineado con el padding del Hero (80px a los lados)
      backgroundColor: "#f3f0e7", // El color crema de fondo que tienes
    },
    exploraTitulo: {
      fontSize: "2rem", // text-3xl
      fontWeight: "bold",
      color: "#171717", // Tu --foreground
      fontFamily: "serif", // Para mantener el estilo editorial
      marginBottom: "12px",
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    exploraSubrayado: {
      width: "60px",
      height: "4px",
      backgroundColor: "#f59e0b", // El detalle ámbar
      borderRadius: "2px",
    },
    article: {
      display: "flex",
      flexDirection: "column" as const,
      backgroundColor: "white",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #f1f5f9",
      height: "100%", // Para que todas midan lo mismo en la grid
      transition: "transform 0.3s ease",
    },
    imageWrapper: {
      position: "relative" as const,
      height: "256px", // h-64
      width: "100%",
      overflow: "hidden",
    },
    body: {
      padding: "24px", // p-6
      display: "flex",
      flexDirection: "column" as const,
      flexGrow: 1,
    },
    tag: {
      fontSize: "10px",
      textTransform: "uppercase" as const,
      letterSpacing: "0.1em",
      fontWeight: "bold",
      color: "#d97706", // amber-600
      backgroundColor: "#fffbeb", // amber-50
      padding: "4px 8px",
      borderRadius: "4px",
      marginRight: "8px",
    },
    titulo: {
      fontSize: "1.25rem", // text-xl
      fontWeight: "bold",
      color: "#0f172a", // slate-900
      marginBottom: "12px",
      lineHeight: "1.4",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical" as const,
      overflow: "hidden",
    },
    contenidoCard: {
      color: "#475569", // slate-600
      fontSize: "0.875rem", // text-sm
      fontWeight: 300,
      lineHeight: "1.6",
      marginBottom: "24px",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical" as const,
      overflow: "hidden",
    },
    footer: {
      marginTop: "auto",
      paddingTop: "16px",
      borderTop: "1px solid #f8fafc",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
  };

  return (
    <div className="w-full flex justify-center bg-slate-50">
      <main style={{paddingBottom: "30px"}} className="max-w-7xl mx-auto">
        {/* =========================
          GRID DE HISTORIAS
      ========================== */}
        <section className="add-story">
          <h1 className="text-3xl font-bold">My Stories</h1>
          <Link href="/mystories/create">
            <button className="btn btn-newproduct">Add New Story</button>
          </Link>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {articles.map((article) => (
            <article
              key={article.id}
              style={{
                ...styles.article, // Tus estilos actuales
                position: "relative", // Necesario para el z-index
                cursor: "pointer", // Indica que se puede hacer clic
              }}
              className="card-hover-effect"
            >
              {/* Imagen */}
              <Link
                href={`/articles/${article.id}`}
                style={styles.imageWrapper}
              >
                <Image
                  src={article.imagen_url}
                  alt={article.titulo}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              </Link>

              <div style={styles.body}>
                {/* Tags */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  {article.tags.map((tag) => (
                    <span key={tag} style={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Título */}
                <h2 style={styles.titulo}>
                  <Link
                    href={`/articles/${article.id}`}
                    style={{ color: "inherit", textDecoration: "none" }}
                  >
                    {article.titulo}
                  </Link>
                </h2>

                {/* Contenido */}
                <p style={styles.contenidoCard}>{article.contenido}</p>

                {/* Footer */}
                <div style={styles.footer}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={article.avatar_url}
                        alt={article.full_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "#334155",
                      }}
                    >
                      {article.full_name}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      fontFamily: "monospace",
                    }}
                  >
                    {new Date(article.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 mt-4 w-full"> 
                <Link
                    href={`/mystories/${article.id}/edit`}
                    className="flex-1 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-700 transition-colors text-center"
                >
                    Edit Story
                </Link>
                
                <Link
                    href={`/mystories/${article.id}/delete`} // O la ruta que maneje el borrado
                    className="flex-1 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors text-center btn-products"
                >
                    Delete Story
                </Link>
                </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
