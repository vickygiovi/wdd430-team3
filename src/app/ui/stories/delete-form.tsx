"use client"

import { deleteStory, DeleteStoryState, StoryState } from "@/app/lib/stories-actions";
import { useActionState } from "react";

// Definimos una interfaz simple para la historia si no la tienes exportada
interface Story {
  id: string;
  titulo: string;
}

export default function DeleteStoryForm({ story }: { story: Story }) {
    // 1. Vinculamos el ID de la historia a la acción
    const deleteStoryWithId = deleteStory.bind(null, story.id);
    
    const initialState: DeleteStoryState = { message: null, error: false };
    
    // 2. Usamos useActionState para manejar el estado de la acción
    const [state, formAction, isPending] = useActionState(deleteStoryWithId, initialState);

    return (
        <form action={formAction}>
            <div>
                <h2 className="text-center">¿Quieres eliminar la historia `&quot;`{story.titulo}`&quot;`?</h2>
            </div>
            <br />
            <div className="text-center">
                <button 
                    type="submit" 
                    className="btn-stories w-50" 
                    disabled={isPending}
                    style={{ backgroundColor: isPending ? '#ccc' : '#dc3545' }}
                >
                    {isPending ? 'Eliminando...' : 'Eliminar'}
                </button>
            </div>
            
            {/* Mostrar mensaje de error si existe */}
            {state.message && (
                <p className="text-center mt-2 text-red-500">{state.message}</p>
            )}
        </form>
    );
}