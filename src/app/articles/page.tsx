import Link from "next/link";
import Image from "next/image";
import path from "path";
import fs from "fs/promises";
import { Article } from "../lib/definitions";

export default async function Page() {
  const filePath = path.join(process.cwd(), "public", "articles.json");
  const json = await fs.readFile(filePath, "utf-8");
  const articles: Article[] = JSON.parse(json);

  const published = articles
    .filter((a) => a.published)
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ); // newest first

  const [featured, ...rest] = published;

  return (
    <main className="max-w-6xl mx-auto p-6 flex flex-col gap-12">

      {/* =========================
          FEATURED ARTICLE
      ========================== */}
      {featured && (
        <section className="relative w-full h-[400px] rounded overflow-hidden shadow-lg">
          <Link href={`/articles/${featured.slug}`}>
            <Image
              src={featured.image ?? "/logo2.png"}
              alt={featured.title}
              fill
              className="object-cover"
            />
          </Link>
          <div className="absolute bottom-0 left-0 w-full bg-black bg-opacity-50 p-6 text-white">
            <h1 className="text-3xl font-bold mb-2">{featured.title}</h1>
            <p className="opacity-90 mb-2">{featured.summary}</p>
            <div className="text-sm opacity-80">
              By {featured.author} • {featured.createdAt}
            </div>
            <Link
              href={`/articles/${featured.slug}`}
              className="inline-block mt-3 px-4 py-2 bg-primary rounded font-semibold"
            >
              Read Article
            </Link>
          </div>
        </section>
      )}

      {/* =========================
          OTHER ARTICLES
      ========================== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rest.map((article) => (
          <article
            key={article.slug}
            className="card bg-white rounded shadow p-4 flex flex-col gap-3"
          >
            <Link href={`/articles/${article.slug}`}>
              <div className="relative w-full h-48 overflow-hidden rounded">
                <Image
                  src={article.image ?? "/logo2.png"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            </Link>

            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold">
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </h2>

              <p className="text-sm opacity-80">{article.summary}</p>

              <div className="flex flex-wrap gap-2 text-xs">
                {article.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 border rounded">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="text-xs opacity-60 mt-auto">
                By {article.author} • {article.createdAt}
              </div>

              <Link
                href={`/articles/${article.slug}`}
                className="btn btn-solid text-center mt-2"
              >
                Read Article
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
