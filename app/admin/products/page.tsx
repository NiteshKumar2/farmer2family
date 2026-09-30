"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
} from "lucide-react";

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  image: string;
  category: string;
  unit: string;
  stock: number;
  farmer?: string;
  featured: boolean;
  active: boolean;
};

type FormData = {
  name: string;
  description: string;
  price: string;
  salePrice: string;
  image: string;
  category: string;
  unit: string;
  stock: string;
  farmer: string;
  featured: boolean;
  active: boolean;
};

const emptyForm: FormData = {
  name: "",
  description: "",
  price: "",
  salePrice: "",
  image: "🌱",
  category: "Vegetables",
  unit: "1 kg",
  stock: "0",
  farmer: "",
  featured: false,
  active: true,
};

const categories = [
  "Vegetables",
  "Fruits",
  "Rice & Grains",
  "Pulses",
  "Dairy",
  "Oils",
  "Spices",
  "Organic Foods",
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products");

      const data = await response.json();

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function updateField(
    field: keyof FormData,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(product: Product) {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      salePrice: product.salePrice
        ? String(product.salePrice)
        : "",
      image: product.image,
      category: product.category,
      unit: product.unit,
      stock: String(product.stock),
      farmer: product.farmer || "",
      featured: product.featured,
      active: product.active,
    });

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveProduct(event: React.FormEvent) {
    event.preventDefault();

    try {
      setSaving(true);

      const payload = {
        ...form,
        price: Number(form.price),
        salePrice: form.salePrice
          ? Number(form.salePrice)
          : undefined,
        stock: Number(form.stock),
      };

      const response = await fetch(
        editingId
          ? `/api/products/${editingId}`
          : "/api/products",
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }

      closeForm();
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Unable to save product");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to delete product");
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Unable to delete product");
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7f1]">

      <div className="mx-auto max-w-7xl px-4 py-8">

        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">

          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
              Farmer2Family Admin
            </p>

            <h1 className="mt-1 text-3xl font-black text-[#26351f]">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage your store products and inventory.
            </p>
          </div>

          <button
            onClick={startAdd}
            className="flex items-center justify-center gap-2 rounded-full bg-[#28551f] px-6 py-3 font-bold text-white hover:bg-[#1d3d18]"
          >
            <Plus size={19} />
            Add Product
          </button>

        </div>

        {/* STATS */}

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <Package className="text-[#28551f]" />
            <p className="mt-4 text-3xl font-black">
              {products.length}
            </p>
            <p className="text-sm text-gray-500">
              Products
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black text-[#28551f]">
              {products.filter((p) => p.active).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Active
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black text-[#d7862c]">
              {products.filter((p) => p.featured).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Featured
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black">
              {products.reduce(
                (total, product) => total + product.stock,
                0
              )}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Total Stock
            </p>
          </div>

        </div>

        {/* PRODUCT TABLE */}

        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-gray-500">
                No products found.
              </p>

              <button
                onClick={startAdd}
                className="mt-4 rounded-full bg-[#28551f] px-6 py-3 font-bold text-white"
              >
                Add your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px]">

                <thead className="border-b bg-[#f8f9f4]">
                  <tr>
                    <th className="px-5 py-4 text-left text-sm">
                      Product
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Category
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Price
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Stock
                    </th>

                    <th className="px-5 py-4 text-left text-sm">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b last:border-0"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f4e9] text-2xl">
                            {product.image}
                          </div>

                          <div>
                            <p className="font-bold">
                              {product.name}
                            </p>

                            <p className="text-xs text-gray-500">
                              {product.unit}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm">
                        {product.category}
                      </td>

                      <td className="px-5 py-4 font-bold">
                        ₹{product.salePrice ?? product.price}
                      </td>

                      <td className="px-5 py-4">
                        {product.stock}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex gap-2">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              product.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {product.active
                              ? "Active"
                              : "Inactive"}
                          </span>

                          {product.featured && (
                            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-700">
                              Featured
                            </span>
                          )}

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => startEdit(product)}
                            className="rounded-lg border p-2 hover:bg-gray-50"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() =>
                              deleteProduct(product._id)
                            }
                            className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white">

            <div className="sticky top-0 flex items-center justify-between border-b bg-white px-6 py-5">

              <div>
                <h2 className="text-xl font-black">
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>

                <p className="text-sm text-gray-500">
                  Product information
                </p>
              </div>

              <button
                onClick={closeForm}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X />
              </button>

            </div>

            <form
              onSubmit={saveProduct}
              className="space-y-5 p-6"
            >

              <div className="grid gap-5 md:grid-cols-2">

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold">
                    Product Name
                  </label>

                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#28551f]"
                    placeholder="Organic Tomatoes"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold">
                    Description
                  </label>

                  <textarea
                    required
                    value={form.description}
                    onChange={(e) =>
                      updateField(
                        "description",
                        e.target.value
                      )
                    }
                    rows={4}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#28551f]"
                    placeholder="Describe the product..."
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Price (₹)
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Sale Price (₹)
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={form.salePrice}
                    onChange={(e) =>
                      updateField(
                        "salePrice",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  >
                    {categories.map((category) => (
                      <option key={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Unit
                  </label>

                  <input
                    required
                    value={form.unit}
                    onChange={(e) =>
                      updateField("unit", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                    placeholder="1 kg"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Stock
                  </label>

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.stock}
                    onChange={(e) =>
                      updateField("stock", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold">
                    Product Icon
                  </label>

                  <input
                    value={form.image}
                    onChange={(e) =>
                      updateField("image", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                    placeholder="🍅"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold">
                    Farmer
                  </label>

                  <input
                    value={form.farmer}
                    onChange={(e) =>
                      updateField("farmer", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                    placeholder="Farmer2Family Farm"
                  />
                </div>

              </div>

              <div className="flex gap-6">

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField(
                        "featured",
                        e.target.checked
                      )
                    }
                  />

                  <span className="text-sm font-semibold">
                    Featured product
                  </span>
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) =>
                      updateField(
                        "active",
                        e.target.checked
                      )
                    }
                  />

                  <span className="text-sm font-semibold">
                    Active
                  </span>
                </label>

              </div>

              <div className="flex justify-end gap-3 border-t pt-5">

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border px-6 py-3 font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[#28551f] px-7 py-3 font-bold text-white disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Product"
                      : "Create Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </main>
  );
}