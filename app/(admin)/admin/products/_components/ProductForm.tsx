'use client';
import { useState } from 'react';
import { Plus, X, Package, DollarSign, BarChart3, Image as ImageIcon, FileText, Loader2, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductInput, ProductType, productFormSchema } from '@/validation/product';
import { createProduct, updateProduct } from '@/app/actions/product-action';

export default function ProductForm({ initialData }: { initialData?: ProductType }) {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductInput>(
        {
            resolver: zodResolver(productFormSchema),
            mode: "onSubmit",
        }
    );

    const prepareFormData = (data: ProductInput) => {
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            if (value instanceof FileList) {
                Array.from(value).forEach(file => formData.append(key, file));
            } else {
                formData.append(key, value as string);
            }
        });
        return formData;
    }

    const onSubmit = async (data: ProductInput) => {
        const formData = prepareFormData(data);

        const result = initialData ? await updateProduct(initialData.id, formData) : await createProduct(formData);

        if (result.error) {
            setMessage("Failed to create product.");
        } else {
            setMessage("Product created successfully!");
            reset();
            setTimeout(() => {
                setMessage(null);
                setIsOpen(false);
            }, 1000);
        }
    };

    const closeModal = () => {
        setIsOpen(false);
        reset();
        setMessage(null);
    }

    return (
        <>
            {initialData ? <button onClick={() => setIsOpen(true)} className="p-2 rounded-lg text-gray-400 hover:text-amber-600 hover:bg-amber-50 transition-all" title="Edit">
                <Pencil className="size-4" />
            </button>
                : <button
                    onClick={() => setIsOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 font-medium text-sm cursor-pointer"
                >
                    <Plus className="size-4" />
                    Create Product
                </button>}
            {/* Backdrop + Modal */}
            <div
                className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isOpen ? "visible opacity-100" : "invisible opacity-0 pointer-events-none"}`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />

                {/* Modal */}
                <div className={`relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden transition-all duration-300 ${isOpen ? "scale-100 translate-y-0" : "scale-95 translate-y-4"}`}>
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                                <Package className="size-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">{initialData ? "Edit Product" : "Create Product"}</h2>
                                <p className="text-xs text-gray-500">{initialData ? "Update your product details" : "Add a new product to your inventory"}</p>
                            </div>
                        </div>
                        <button
                            onClick={closeModal}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                            <X className="size-5 text-gray-400" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Body */}
                        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
                            {message && <p className={`text-sm font-medium ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>{message}</p>}
                            {/* Product Name */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                    <Package className="size-3.5 text-gray-400" />
                                    Product Name
                                </label>
                                <input
                                    type="text"
                                    {...register("name")}
                                    defaultValue={initialData?.name || undefined}
                                    placeholder="e.g. Wireless Bluetooth Headphones"
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-gray-300 transition-all duration-200 bg-gray-50/50 focus:bg-white outline-none"
                                />
                                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                            </div>

                            {/* Description */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                    <FileText className="size-3.5 text-gray-400" />
                                    Description
                                </label>
                                <textarea
                                    {...register("description")}
                                    defaultValue={initialData?.description || undefined}
                                    placeholder="Describe your product..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-gray-300 transition-all duration-200 bg-gray-50/50 focus:bg-white outline-none resize-none"
                                />
                                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                            </div>

                            {/* Price + Stock */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                        <DollarSign className="size-3.5 text-gray-400" />
                                        Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">฿</span>
                                        <input
                                            type="number"
                                            {...register("price", {
                                                setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                            })}
                                            defaultValue={initialData?.price}
                                            placeholder="0.00"
                                            step={0.01}
                                            className="w-full pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-gray-300 transition-all duration-200 bg-gray-50/50 focus:bg-white outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                        <BarChart3 className="size-3.5 text-gray-400" />
                                        Stock
                                    </label>
                                    <input
                                        type="number"
                                        {...register("stock", {
                                            setValueAs: (v) => (v === "" ? undefined : Number(v)),
                                        })}
                                        defaultValue={initialData?.stock}
                                        placeholder="0"
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-gray-300 transition-all duration-200 bg-gray-50/50 focus:bg-white outline-none"
                                    />
                                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                                </div>
                            </div>

                            {/* Image URL */}
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                                    <ImageIcon className="size-3.5 text-gray-400" />
                                    Product Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    {...register("image")}
                                    className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary hover:border-gray-300 transition-all duration-200 bg-gray-50/50 focus:bg-white outline-none cursor-pointer"
                                />
                                {errors.image?.message && <p className="text-red-500 text-sm mt-1">{String(errors.image.message)}</p>}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <button
                                type='button'
                                onClick={closeModal}
                                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        {initialData ? "Updating..." : "Saving..."}
                                    </>
                                ) : (
                                    <>
                                        {initialData ? "Update Product" : "Save Product"}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}