'use client';
import { useState } from 'react';
import { Plus, X, Package, DollarSign, BarChart3, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductInput, productSchema } from '@/validation/product';
import { createProduct } from '@/app/actions/product-action';

export default function CreateProductForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductInput>(
        {
            resolver: zodResolver(productSchema),
            mode: "onBlur",
        }
    );

    const onSubmit = async (data: ProductInput) => {
        const result = await createProduct(data);
        console.log("Create Product Result:", result);
        if (result.error) {
            setMessage("Failed to create product.");
        } else {
            setMessage("Product created successfully!");
            reset();
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 active:scale-[0.98] transition-all duration-200 shadow-md shadow-primary/20 font-medium text-sm cursor-pointer"
            >
                <Plus className="size-4" />
                Create Product
            </button>

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
                                <h2 className="text-lg font-bold text-gray-900">Create Product</h2>
                                <p className="text-xs text-gray-500">Add a new product to your inventory</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
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
                                            {...register("price")}
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
                                        {...register("stock")}
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
                                {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image.message}</p>}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                            <button
                                type='button'
                                onClick={() => setIsOpen(false)}
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
                                        Saving...
                                    </>
                                ) : (
                                    "Save Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}