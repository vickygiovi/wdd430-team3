'use client'

import { createReview, ReviewState } from "@/app/lib/review-actions";
import { useActionState } from "react";

interface FormProps {
    productId: string;
    userId: string;
}

export default function Form({ productId, userId }: FormProps) {
    const initialState: ReviewState = { message: null, errors: {} };
    
    // Inyectamos los dos campos usando bind
    // El primer argumento es 'null' (el context de 'this'), los siguientes son tus argumentos
    const createReviewWithIds = createReview.bind(null, productId, userId);
    
    const [state, formAction] = useActionState(createReviewWithIds, initialState);

    return (
        <form action={formAction}>
            {/* Mensaje general si existe */}
            {state.message && (
                <p className={state.success ? "text-success" : "text-error"}>
                    {state.message}
                </p>
            )}

            <div className="rating-input">
                <label>Puntuación:</label>
                <select name="rating">
                    <option value="5">5 ⭐ (Excelente)</option>
                    <option value="4">4 ⭐ (Muy bueno)</option>
                    <option value="3">3 ⭐ (Bueno)</option>
                    <option value="2">2 ⭐ (Regular)</option>
                    <option value="1">1 ⭐ (Malo)</option>
                </select>
                {state.errors?.rating && <span className="error">{state.errors.rating[0]}</span>}
            </div>

            <div className="comment-input">
                <textarea 
                    name="comment" // ¡No olvides el name para que formData lo detecte!
                    placeholder="Cuéntanos qué te pareció el producto..."
                    rows={4}
                />
                {state.errors?.comment && <span className="error">{state.errors.comment[0]}</span>}
            </div>

            <button type="submit" className="create-button">
                Publicar reseña
            </button>
        </form>
    );
}