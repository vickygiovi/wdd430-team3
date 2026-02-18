"use client"

import { Product } from "@/app/lib/products-data";
import { deleteProduct, StateDeletingProduct } from "@/app/lib/products-actions";
import { useActionState, useState, useTransition } from "react"; // 1. Importar useTransition

export default function Form ({ product }: { product: Product }) {
    const deleteProductWithId = deleteProduct.bind(null, product.id)
    const initialState: StateDeletingProduct = { message: null };
    const [state, formAction] = useActionState(deleteProductWithId, initialState);

    return (
        <form action={formAction}>
            <div>
                <h2 className="text-center">Do you want to delete {product.name}?</h2>
            </div>
            <br />
            <div className="text-center">
                <button type="submit" className="btn-stories w-50">
                    Delete
                </button>
            </div>
        </form>
    )
}