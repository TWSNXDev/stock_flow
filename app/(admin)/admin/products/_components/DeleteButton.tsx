"use client"
import { deleteProduct } from "@/app/actions/product-action";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteButton({ productId }: { productId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsDeleting(true);
        const { error } = await deleteProduct(productId);
        if (error) {
            setError(error);
            setIsDeleting(false);
            return;
        }
        setIsOpen(false);
        setIsDeleting(false);
    }

    return (
        <>
            {!isOpen ? <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all" title="Delete">
                <Trash2 className="size-4" />
            </button> :
                < div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <Trash2 className="size-5 text-red-600" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Confirm Deletion</h2>
                        </div>
                        <p className="mb-8 text-gray-500 leading-relaxed">Are you sure you want to delete this product? This action cannot be undone.</p>
                        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className={`px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div >
            }
        </>
    )
}