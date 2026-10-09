"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  X,
  Image as ImageIcon,
  Upload,
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
  image: "",
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

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormData>(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);

      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to load products");
      }

      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Load products error:", error);
      alert("Unable to load products. Please try again.");
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
    setForm({ ...emptyForm });
    setImagePreview("");
    setShowForm(true);
  }

  function startEdit(product: Product) {
    setEditingId(product._id);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: String(product.price ?? ""),
      salePrice:
        product.salePrice != null
          ? String(product.salePrice)
          : "",
      image: product.image || "",
      category: product.category || "Vegetables",
      unit: product.unit || "1 kg",
      stock: String(product.stock ?? 0),
      farmer: product.farmer || "",
      featured: Boolean(product.featured),
      active: product.active !== false,
    });

    setImagePreview(
      product.image?.startsWith("data:image/")
        ? product.image
        : product.image?.startsWith("http")
          ? product.image
          : ""
    );

    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
    setImagePreview("");
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      alert("Please select an image smaller than 2 MB.");
      event.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const base64 = await new Promise<string>(
        (resolve, reject) => {
          const reader = new FileReader();

          reader.onload = () => {
            if (typeof reader.result === "string") {
              resolve(reader.result);
            } else {
              reject(new Error("Unable to read image"));
            }
          };

          reader.onerror = () => {
            reject(new Error("Unable to read image"));
          };

          reader.readAsDataURL(file);
        }
      );

      updateField("image", base64);
      setImagePreview(base64);
    } catch (error) {
      console.error("Image read error:", error);
      alert("Unable to read the selected image.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function removeImage() {
    updateField("image", "");
    setImagePreview("");
  }

  async function saveProduct(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (uploading) {
      alert("Please wait for the image to finish loading.");
      return;
    }

    if (!form.image.trim()) {
      alert("Please upload a product image.");
      return;
    }

    const price = Number(form.price);
    const salePrice =
      form.salePrice.trim() !== ""
        ? Number(form.salePrice)
        : undefined;
    const stock = Number(form.stock);

    if (
      !Number.isFinite(price) ||
      price < 0 ||
      !Number.isFinite(stock) ||
      stock < 0
    ) {
      alert("Please enter a valid price and stock quantity.");
      return;
    }

    if (
      salePrice !== undefined &&
      (!Number.isFinite(salePrice) ||
        salePrice < 0 ||
        salePrice > price)
    ) {
      alert("Sale price must be valid and cannot exceed the regular price.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        price,
        salePrice,
        stock,
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
        alert(data.error || "Unable to save product.");
        return;
      }

      closeForm();
      await loadProducts();
      alert(
        editingId
          ? "Product updated successfully."
          : "Product created successfully."
      );
    } catch (error) {
      console.error("Save product error:", error);
      alert(
        "Unable to save product. Check your connection and API."
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Unable to delete product.");
        return;
      }

      await loadProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Unable to delete product.");
    }
  }

  function renderProductImage(
    image: string | undefined,
    name: string,
    className: string
  ) {
    if (
      image?.startsWith("data:image/") ||
      image?.startsWith("https://") ||
      image?.startsWith("http://") ||
      image?.startsWith("/")
    ) {
      return (
        <img
          src={image}
          alt={name}
          className={className}
        />
      );
    }

    return (
      <div
        className={`${className} flex items-center justify-center bg-[#f1f4e9] text-2xl`}
        aria-label={name}
      >
        {image || "🌱"}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7f1]">
      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-[#d7862c]">
              Farmer2Family Admin
            </p>

            <h1 className="mt-1 text-3xl font-black text-[#26351f]">
              Products
            </h1>

            <p className="mt-2 text-gray-600">
              Manage product images, prices, and inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={startAdd}
            className="flex items-center justify-center gap-2 rounded-full bg-[#28551f] px-6 py-3 font-bold text-white transition hover:bg-[#1d3d18]"
          >
            <Plus size={19} />
            Add Product
          </button>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <Package className="text-[#28551f]" />
            <p className="mt-4 text-3xl font-black">
              {products.length}
            </p>
            <p className="text-sm text-gray-500">Products</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black text-[#28551f]">
              {products.filter((p) => p.active).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">Active</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black text-[#d7862c]">
              {products.filter((p) => p.featured).length}
            </p>
            <p className="mt-1 text-sm text-gray-500">Featured</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-3xl font-black">
              {products.reduce(
                (total, product) => total + (product.stock || 0),
                0
              )}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Total Stock
            </p>
          </div>
        </div>

        {/* Products table */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="p-10 text-center">
              <Package
                size={42}
                className="mx-auto text-gray-300"
              />
              <p className="mt-3 text-gray-500">
                No products found.
              </p>

              <button
                type="button"
                onClick={startAdd}
                className="mt-4 rounded-full bg-[#28551f] px-6 py-3 font-bold text-white"
              >
                Add your first product
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-200">
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
                          {renderProductImage(
                            product.image,
                            product.name,
                            "h-12 w-12 shrink-0 rounded-xl object-cover"
                          )}

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

                      <td className="px-5 py-4">
                        <p className="font-bold">
                          ₹{product.salePrice ?? product.price}
                        </p>
                        {product.salePrice != null && (
                          <p className="text-xs text-gray-400 line-through">
                            ₹{product.price}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        {product.stock}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              product.active
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {product.active ? "Active" : "Inactive"}
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
                            type="button"
                            onClick={() => startEdit(product)}
                            className="rounded-lg border p-2 hover:bg-gray-50"
                            title="Edit product"
                            aria-label={`Edit ${product.name}`}
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteProduct(product._id)
                            }
                            className="rounded-lg border p-2 text-red-600 hover:bg-red-50"
                            title="Delete product"
                            aria-label={`Delete ${product.name}`}
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

      {/* Add / Edit modal */}
      {showForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-5">
              <div>
                <h2 className="text-xl font-black text-[#26351f]">
                  {editingId ? "Edit Product" : "Add Product"}
                </h2>
                <p className="text-sm text-gray-500">
                  Product information and image
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="rounded-full p-2 hover:bg-gray-100"
                aria-label="Close form"
              >
                <X />
              </button>
            </div>

            <form
              onSubmit={saveProduct}
              className="space-y-5 p-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                {/* Product name */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="product-name"
                    className="mb-2 block text-sm font-bold"
                  >
                    Product Name
                  </label>
                  <input
                    id="product-name"
                    required
                    value={form.name}
                    onChange={(e) =>
                      updateField("name", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#28551f]"
                    placeholder="Organic Tomatoes"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="product-description"
                    className="mb-2 block text-sm font-bold"
                  >
                    Description
                  </label>
                  <textarea
                    id="product-description"
                    required
                    value={form.description}
                    onChange={(e) =>
                      updateField("description", e.target.value)
                    }
                    rows={4}
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#28551f]"
                    placeholder="Describe the product..."
                  />
                </div>

                {/* Product image upload */}
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-bold">
                    Product Image
                  </label>

                  <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-[#fafbf8] p-5">
                    {imagePreview || form.image ? (
                      <div className="mb-4">
                        {renderProductImage(
                          imagePreview || form.image,
                          form.name || "Product preview",
                          "h-48 w-full rounded-xl bg-white object-contain"
                        )}

                        <button
                          type="button"
                          onClick={removeImage}
                          className="mt-3 text-sm font-semibold text-red-600 hover:text-red-700"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="mb-4 flex flex-col items-center text-center">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#eef4e8] text-[#28551f]">
                          <ImageIcon size={28} />
                        </div>
                        <p className="mt-3 font-semibold text-gray-700">
                          Upload a product photo
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          JPG, PNG, or WebP · Maximum 2 MB
                        </p>
                      </div>
                    )}

                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#28551f] px-5 py-3 font-bold text-white transition hover:bg-[#1d3d18]">
                      <Upload size={18} />
                      {uploading
                        ? "Reading image..."
                        : imagePreview || form.image
                          ? "Change Image"
                          : "Choose Image"}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageUpload}
                        disabled={uploading || saving}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Price */}
                <div>
                  <label
                    htmlFor="product-price"
                    className="mb-2 block text-sm font-bold"
                  >
                    Price (₹)
                  </label>
                  <input
                    id="product-price"
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      updateField("price", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#28551f]"
                    placeholder="100"
                  />
                </div>

                {/* Sale price */}
                <div>
                  <label
                    htmlFor="product-sale-price"
                    className="mb-2 block text-sm font-bold"
                  >
                    Sale Price (₹)
                  </label>
                  <input
                    id="product-sale-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.salePrice}
                    onChange={(e) =>
                      updateField("salePrice", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3 outline-none focus:border-[#28551f]"
                    placeholder="Optional"
                  />
                </div>

                {/* Category */}
                <div>
                  <label
                    htmlFor="product-category"
                    className="mb-2 block text-sm font-bold"
                  >
                    Category
                  </label>
                  <select
                    id="product-category"
                    value={form.category}
                    onChange={(e) =>
                      updateField("category", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Unit */}
                <div>
                  <label
                    htmlFor="product-unit"
                    className="mb-2 block text-sm font-bold"
                  >
                    Unit
                  </label>
                  <input
                    id="product-unit"
                    required
                    value={form.unit}
                    onChange={(e) =>
                      updateField("unit", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                    placeholder="1 kg"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label
                    htmlFor="product-stock"
                    className="mb-2 block text-sm font-bold"
                  >
                    Stock
                  </label>
                  <input
                    id="product-stock"
                    required
                    type="number"
                    min="0"
                    step="1"
                    value={form.stock}
                    onChange={(e) =>
                      updateField("stock", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                  />
                </div>

                {/* Farmer */}
                <div>
                  <label
                    htmlFor="product-farmer"
                    className="mb-2 block text-sm font-bold"
                  >
                    Farmer
                  </label>
                  <input
                    id="product-farmer"
                    value={form.farmer}
                    onChange={(e) =>
                      updateField("farmer", e.target.value)
                    }
                    className="w-full rounded-xl border px-4 py-3"
                    placeholder="Farmer2Family Farm"
                  />
                </div>
              </div>

              {/* Product options */}
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField("featured", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#28551f]"
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
                      updateField("active", e.target.checked)
                    }
                    className="h-4 w-4 accent-[#28551f]"
                  />
                  <span className="text-sm font-semibold">
                    Active
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-full border px-6 py-3 font-bold disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="rounded-full bg-[#28551f] px-7 py-3 font-bold text-white transition hover:bg-[#1d3d18] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {uploading
                    ? "Reading image..."
                    : saving
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
