import { Tag, Package, FolderOpen } from "lucide-react";
import { getCategories } from "@/app/actions/category-action";
import CategoryForm from "./_components/CategoryForm";
import DeleteCategoryButton from "./_components/DeleteCategoryButton";

export default async function CategoryPage() {
  const { categories } = await getCategories();

  const totalCategories = categories?.length ?? 0;
  const withProducts = categories?.filter((c) => c._count.products > 0).length ?? 0;
  const empty = totalCategories - withProducts;

  return (
    <div className="p-3 sm:p-6 space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10">
            <Tag className="size-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-sm text-gray-500">Organize your products by category</p>
          </div>
        </div>
        <CategoryForm />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Tag className="size-5 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
            <p className="text-xs text-gray-500">Total Categories</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Package className="size-5 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{withProducts}</p>
            <p className="text-xs text-gray-500">With Products</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <FolderOpen className="size-5 text-amber-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{empty}</p>
            <p className="text-xs text-gray-500">Empty Categories</p>
          </div>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-700">All Categories</h2>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Tag className="size-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {category.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          category._count.products > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {category._count.products}{" "}
                        {category._count.products === 1 ? "product" : "products"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <CategoryForm
                          initialData={{ id: category.id, name: category.name }}
                        />
                        <DeleteCategoryButton categoryId={category.id} />
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-5 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <FolderOpen className="size-5 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">No categories yet</p>
                      <p className="text-xs text-gray-400">Create your first category to get started</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/50">
          <p className="text-xs text-gray-500">
            Showing {totalCategories} {totalCategories === 1 ? "category" : "categories"}
          </p>
        </div>
      </div>
    </div>
  );
}
