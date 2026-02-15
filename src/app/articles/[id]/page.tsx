import { Article } from '@/app/lib/definitions';
import { fetchStoryById } from '@/app/lib/stories-data';
import Image from 'next/image';
import '../articles.css';

const YouTubeEmbed = ({ embedId }: { embedId: string }) => {
    const embedUrl = getYouTubeEmbedUrl(embedId);

    if (!embedUrl) return <p>URL de video no válida</p>;

    return (
    <div className="aspect-video w-full">
        <iframe
        src={embedUrl}
        className="w-full h-full rounded-lg"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        />
    </div>
    );
}

const getYouTubeEmbedUrl = (url: string) => {
  // Extrae el ID del video (funciona con links normales y cortos)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return null;
};

export default async function ArticlePage({
  params,
}: {
  params: { id: string };
}) {   
    const { id } = await params;
    const article: Article = await fetchStoryById(id);
    console.log(article);

    if (!article) return <div>Article Not Found</div>

    return (
  <main className="blog-container">
    {/* Header: Título y Resumen */}
    <header className="blog-header">
      <h1 className="blog-title">{article.titulo}</h1>
      <h2 className="blog-summary">{article.contenido}</h2>

      {/* Autor: Avatar y Nombre combinados */}
      <div className="blog-author">
        <Image 
          src={article.avatar_url} 
          alt={article.full_name} 
          width={60} 
          height={60} 
          className="author-avatar"
        />
        <h3 className="author-name">Por <span>{article.full_name}</span></h3>
      </div>
    </header>

    {/* Imagen Principal: Con aire a los lados */}
    <div className="blog-hero-image">
      <Image 
        src={article.imagen_url} 
        alt={article.titulo} 
        width={1200} 
        height={675} 
        className="main-img"
        priority
      />
    </div>

    {/* Cuerpo del Post */}
    <article className="blog-content">
      <p className="post-text">{article.post}</p>
    </article>

    {/* Video: Centrado y con aire */}
    <section className="blog-video-section">
      <div className="video-wrapper">
        <YouTubeEmbed embedId={article.video_url} />
      </div>
    </section>

    {/* Botón de Likes */}
    <footer className="blog-footer">
      <button className="like-button">
        <span className="heart-icon">❤️</span>
        <span className="like-text">Inspirado ({article.likes_count})</span>
      </button>
    </footer>
  </main>
);
}