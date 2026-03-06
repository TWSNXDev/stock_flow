import { Package } from "lucide-react";
import { getFilteredProducts, getInventoryStats } from "@/app/actions/product-action";
import DeleteButton from "./_components/DeleteButton";
import ProductForm from "./_components/ProductForm";
import SearchFilter from "./_components/SearchFilter";
import FilterDropdown from "./_components/FilterDropdown";
import PaginationControls from "./_components/PaginationControls";
import PageSizeSelector from "./_components/PageSizeSelector";
import Image from "next/image";

export default async function ProductPage({ searchParams }: { searchParams: Promise<{ page?: string; size?: string; query?: string; stock?: string; sort?: string }> }) {
    const { page,size, query, stock, sort } = await searchParams;
    const pageSize = Number(size) || 2;
    const currentPage = Number(page) || 1;
    const skip = (currentPage - 1) * pageSize;
    const inventoryStatus = await getInventoryStats();
    const data = await getFilteredProducts({ query, stock, sort, pageSize, skip });

    const products = data.products || [];
    return (
        <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10">
                        <Package className="size-5 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                        <p className="text-sm text-gray-500">Manage your product inventory</p>
                    </div>
                </div>
                <ProductForm />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Package className="size-5 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{inventoryStatus.totalItems}</p>
                        <p className="text-xs text-gray-500">Total Products</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Package className="size-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{inventoryStatus.inStock}</p>
                        <p className="text-xs text-gray-500">In Stock</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                        <Package className="size-5 text-red-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-900">{inventoryStatus.outOfStock}</p>
                        <p className="text-xs text-gray-500">Out of Stock</p>
                    </div>
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                {/* Table Toolbar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
                    <SearchFilter />
                    <div className="flex items-center gap-2">
                        <PageSizeSelector />
                        <FilterDropdown /></div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50/80">
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products?.length ? products.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50/60 transition-colors">
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                                                {product.imageUrl ? <Image width={36} height={36} src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-lg object-cover" /> : <Package className="size-4 text-gray-400" />}
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-4">
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                            {product.description}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-semibold text-gray-900">฿{product.price.toString()}</td>
                                    <td className="px-5 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <ProductForm initialData={{
                                                id: product.id,
                                                name: product.name,
                                                description: product.description,
                                                price: Number(product.price),
                                                stock: product.stock,
                                                imageUrl: product.imageUrl
                                            }} />
                                            <DeleteButton productId={product.id} />
                                        </div>
                                    </td>
                                </tr>)) : <tr><td colSpan={5} className="px-5 py-4 text-center text-sm text-gray-500">No products found.</td></tr>}
                        </tbody>
                    </table>
                </div>

                {/* Table Footer */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-3 sm:px-5 py-3 border-t border-gray-100 bg-gray-50/50">
                    <p className="text-xs text-gray-500">Showing {products ? products.length > 0 ? `${products.length} of ${data.totalCount}` : 0 : 0} products</p>
                    <PaginationControls hasNextPage={currentPage < Math.ceil(Number(data.totalCount) / pageSize)} hasPrevPage={currentPage > 1} currentPage={currentPage} />
                </div>
            </div>
        </div>
    );
}