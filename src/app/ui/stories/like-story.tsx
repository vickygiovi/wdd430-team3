"use client";

import { useActionState } from "react";
import { likeStory, StateLikes } from "@/app/lib/stories-actions";

export default function Form({ likes_count, id }: { likes_count: number, id: string }) {
    const likeStoryWithId = likeStory.bind(null, id);
    const initialState: StateLikes = { message: null, error: false };
    const [state, formAction] = useActionState(likeStoryWithId, initialState);

    return (
        <form action={formAction}>
        <footer className="blog-footer">
            <button className="like-button" type="submit">
            <span className="heart-icon">❤️</span>
            <span className="like-text">Inspirado ({likes_count})</span>
            </button>
        </footer>
        </form>
    );
}
