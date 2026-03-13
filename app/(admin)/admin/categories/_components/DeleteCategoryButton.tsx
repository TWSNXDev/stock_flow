"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "@/app/actions/category-action";

export default function DeleteCategoryButton({ categoryId }: { categoryId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    const result = await deleteCategory(categoryId);
    if (result.error) {
      setError(result.error);
      setIsDeleting(false);
      return;
    }
    setIsOpen(false);
    setIsDeleting(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 rounded-lg cursor-pointer text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>

      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

        <div
          className={`relative bg-white rounded-2xl p-8 w-full max-w-md mx-4 shadow-2xl border border-gray-100 transition-all duration-300 ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Trash2 className="size-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Category</h2>
          </div>

          <p className="mb-6 text-gray-500 leading-relaxed">
            Are you sure you want to delete this category? This action cannot be undone.
          </p>

          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setIsOpen(false); setError(null); }}
              className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 hover:shadow-lg hover:shadow-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
