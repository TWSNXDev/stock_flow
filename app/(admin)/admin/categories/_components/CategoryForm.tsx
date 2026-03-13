"use client";

import { useState } from "react";
import { Plus, X, Loader2, Pencil, Tag } from "lucide-react";
import { createCategory, updateCategory } from "@/app/actions/category-action";

type CategoryFormProps = {
  initialData?: { id: string; name: string };
};

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialData?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const result = initialData
      ? await updateCategory(initialData.id, name)
      : await createCategory(name);

    if (result.error) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message ?? "Success!");
    if (!initialData) setName("");
    setTimeout(() => {
      setMessage(null);
      setIsOpen(false);
    }, 1000);
    setIsSubmitting(false);
  };

  const closeModal = () => {
    setIsOpen(false);
    setName(initialData?.name ?? "");
    setError(null);
    setMessage(null);
  };

  return (
    <>
      {/* Trigger Button */}
      {initialData ? (
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
          title="Edit"
        >
          <Pencil className="size-4" />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 font-medium text-sm cursor-pointer"
        >
          <Plus className="size-4" />
          Create Category
        </button>
      )}

      {/* Modal */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${
          isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />

        {/* Content */}
        <div
          className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transition-all duration-300 ${
            isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Tag className="size-4 text-primary" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                {initialData ? "Edit Category" : "New Category"}
              </h2>
            </div>
            <button
              onClick={closeModal}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label htmlFor="category-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                Category Name
              </label>
              <input
                id="category-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Electronics, Clothing..."
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                autoFocus
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-2.5 text-sm text-green-600">
                {message}
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeModal}
                className="px-5 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name.trim()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving...
                  </>
                ) : initialData ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
