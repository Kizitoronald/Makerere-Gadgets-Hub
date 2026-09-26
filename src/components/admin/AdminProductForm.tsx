import React, { useState } from 'react';
import { X, Plus, Trash2, Save, Image as ImageIcon } from 'lucide-react';
import { Product, Category } from '../../types';
import { formatUGX, calculateDiscount } from '../../utils/currency';

interface AdminProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const AdminProductForm: React.FC<AdminProductFormProps> = ({
  product,
  categories,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState(product?.name || '');
  const [category, setCategory] = useState(product?.category || (categories[0]?.name || 'Chargers & Adapters'));
  const [price, setPrice] = useState<number>(product?.price || 20000);
  const [previousPrice, setPreviousPrice] = useState<number | undefined>(product?.previousPrice);
  const [stock, setStock] = useState<number>(product?.stock ?? 10);
  const [description, setDescription] = useState(product?.description || '');
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || '/src/assets/images/product_fast_charger_1790413162955.jpg');
  const [featured, setFeatured] = useState(product?.featured || false);
  const [specifications, setSpecifications] = useState<{ key: string; value: string }[]>(
    product?.specifications || [
      { key: 'Warranty / Testing', value: 'Tested before delivery' },
      { key: 'Compatibility', value: 'Universal' }
    ]
  );

  const sampleAvailableImages = [
    { label: '65W Fast Charger', url: '/src/assets/images/product_fast_charger_1790413162955.jpg' },
    { label: 'Air F9 Earbuds', url: '/src/assets/images/product_air_earbuds_1790413175130.jpg' },
    { label: '6-Way Extension Cable', url: '/src/assets/images/product_extension_cable_1790413185846.jpg' },
    { label: 'Electric Hot Plate', url: '/src/assets/images/product_single_hotplate_1790413196853.jpg' },
    { label: 'Gadgets Hub Hero Banner', url: '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg' }
  ];

  const handleAddSpec = () => {
    setSpecifications([...specifications, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecifications(specifications.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specifications];
    updated[index][field] = val;
    setSpecifications(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const discountPercentage = calculateDiscount(price, previousPrice);

    const savedProduct: Product = {
      id: product?.id || `prod-${Date.now()}`,
      name: name.trim(),
      slug: product?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category,
      price: Number(price),
      previousPrice: previousPrice ? Number(previousPrice) : undefined,
      discountPercentage,
      stock: Number(stock),
      inStock: Number(stock) > 0,
      description: description.trim(),
      images: [imageUrl.trim() || '/src/assets/images/hero_gadgets_showcase_1790413151406.jpg'],
      specifications: specifications.filter(s => s.key.trim() && s.value.trim()),
      featured,
      rating: product?.rating || 4.8,
      reviewCount: product?.reviewCount || 12,
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(savedProduct);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <h3 className="font-display font-bold text-base text-slate-900">
            {product ? 'Edit Product' : 'Add New Gadget to Catalogue'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 65W Fast Charger (GaN)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Stock Quantity (Units)
              </label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
              />
            </div>
          </div>

          {/* Pricing in UGX */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Current Selling Price (UGX) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="500"
                step="500"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-mono font-bold"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Formatted: {formatUGX(price)}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Previous Price (Optional, for Discount)
              </label>
              <input
                type="number"
                min="0"
                step="500"
                placeholder="e.g. 30000"
                value={previousPrice || ''}
                onChange={(e) => setPreviousPrice(e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white font-mono"
              />
              {previousPrice && previousPrice > price && (
                <span className="text-[11px] text-red-600 font-semibold mt-1 block">
                  Discount: {calculateDiscount(price, previousPrice)}% OFF
                </span>
              )}
            </div>
          </div>

          {/* Image Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span>Product Image Asset / URL</span>
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="/src/assets/images/... or https://..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
            />
            {/* Quick Image Presets */}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[11px] text-slate-400 self-center mr-1">Sample Assets:</span>
              {sampleAvailableImages.map((img) => (
                <button
                  type="button"
                  key={img.url}
                  onClick={() => setImageUrl(img.url)}
                  className={`text-[11px] px-2 py-1 rounded border transition-colors ${
                    imageUrl === img.url
                      ? 'bg-sky-50 border-sky-400 text-sky-800 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {img.label}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Product Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe gadget features, compatibility, and campus utility..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featuredToggle"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="rounded text-sky-600 focus:ring-sky-500 h-4 w-4"
            />
            <label htmlFor="featuredToggle" className="text-xs font-semibold text-slate-800 cursor-pointer">
              Mark as Featured Product (Shown on Homepage highlights)
            </label>
          </div>

          {/* Specifications Builder */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Technical Specifications
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Spec</span>
              </button>
            </div>
            <div className="space-y-2">
              {specifications.map((spec, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Feature (e.g. Battery Life)"
                    value={spec.key}
                    onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                    className="w-1/3 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Up to 12 Hours)"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(index)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-200 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm"
            >
              <Save className="w-3.5 h-3.5 text-sky-400" />
              <span>Save Product</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
