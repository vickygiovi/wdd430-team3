import path from 'path';
import fs from 'fs/promises';
import { Article } from '@/app/lib/definitions';

type Props = {params: {slug: string}};


export default async function ArticlePage({params} : Props) {
    const filePath = path.join(process.cwd(), 'public', 'articles.json')
    const data = await fs.readFile(filePath, 'utf-8');
    const articles: Article[] = JSON.parse(data);
    const resParams = await params;
    const paramSlug = resParams.slug;

    
    const article = articles.find(article => article.slug === paramSlug);
    console.log(article);

    if (!article) return <div>Article Not Found</div>

    return(
        <div>
            <h1>{article.title}</h1>
            <p>{article.content}</p>
        </div>
    )
}