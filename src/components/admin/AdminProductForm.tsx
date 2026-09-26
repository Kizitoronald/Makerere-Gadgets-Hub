import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Trash2, 
  Save, 
  Image as ImageIcon, 
  UploadCloud, 
  Camera, 
  CheckCircle2, 
  Loader2 
} from 'lucide-react';
import { Product, Category } from '../../types';
import { formatUGX, calculateDiscount } from '../../utils/currency';
import { processImageFile } from '../../utils/imageUpload';

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
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState(false);
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelected = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      setIsProcessingImage(true);
      setImageError('');
      // Compress and resize for fast web delivery & lightweight localStorage persistence
      const processedDataUrl = await processImageFile(file, {
        maxWidth: 900,
        maxHeight: 900,
        quality: 0.85
      });

      setImageUrl(processedDataUrl);
      setImageUploadSuccess(true);
      setTimeout(() => setImageUploadSuccess(false), 3500);
    } catch (err: any) {
      console.error('Error processing uploaded image:', err);
      setImageError('Could not process this image. Please choose another photo.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelected(file);
    }
  };

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

          {/* Product Image Upload & Selection (Phone Gallery, Camera, Desktop & Presets) */}
          <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-sky-600" />
                <span>Product Image (Phone Gallery & Desktop)</span>
              </label>
              {imageUploadSuccess && (
                <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Photo loaded!</span>
                </span>
              )}
            </div>

            {/* Hidden standard file picker for desktop/gallery */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileInputChange}
            />

            {/* Hidden camera capture input for phones */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileInputChange}
            />

            {/* Interactive Upload Box with Drag & Drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative rounded-xl border-2 border-dashed p-4 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer ${
                isDragging
                  ? 'border-sky-500 bg-sky-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-sky-400 bg-white hover:bg-slate-50/80'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              {isProcessingImage ? (
                <div className="py-6 flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 text-sky-600 animate-spin" />
                  <span className="text-xs font-semibold text-slate-700">
                    Optimizing photo for phone & web...
                  </span>
                </div>
              ) : imageUrl ? (
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full text-left">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                    <img
                      src={imageUrl}
                      alt="Selected product preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] text-white font-bold">
                      Change
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <div className="text-xs font-bold text-slate-800">
                      Product Photo Ready
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Tap anywhere to choose a different photo from your phone gallery or desktop folder.
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-bold flex items-center gap-1.5 hover:bg-slate-800 shadow-xs"
                      >
                        <UploadCloud className="w-3.5 h-3.5 text-sky-400" />
                        <span>Choose From Gallery / Files</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          cameraInputRef.current?.click();
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-800 border border-sky-200 text-[11px] font-bold flex items-center gap-1.5 hover:bg-sky-100"
                      >
                        <Camera className="w-3.5 h-3.5 text-sky-600" />
                        <span>Take Photo (Camera)</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center mb-2">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    Upload from Phone Gallery or Desktop
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Tap to browse camera roll, photos, or drag & drop image here
                  </div>
                </div>
              )}
            </div>

            {/* Error Message */}
            {imageError && (
              <div className="text-[11px] text-rose-600 font-semibold">
                {imageError}
              </div>
            )}

            {/* Direct Image URL fallback & Sample presets toggle */}
            <div className="pt-2 border-t border-slate-200 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-medium">Or pick from existing inventory presets:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {sampleAvailableImages.map((img) => (
                  <button
                    type="button"
                    key={img.url}
                    onClick={() => {
                      setImageUrl(img.url);
                      setImageUploadSuccess(true);
                      setTimeout(() => setImageUploadSuccess(false), 2500);
                    }}
                    className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors ${
                      imageUrl === img.url
                        ? 'bg-sky-50 border-sky-400 text-sky-800 font-bold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {img.label}
                  </button>
                ))}
              </div>

              {/* Advanced Image URL Input */}
              <div className="pt-1">
                <details className="text-[11px] text-slate-500">
                  <summary className="cursor-pointer hover:text-slate-800 font-medium">
                    Or paste an external web image link (URL)
                  </summary>
                  <div className="mt-1.5">
                    <input
                      type="text"
                      value={imageUrl.startsWith('data:') ? '' : imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/gadget-photo.jpg"
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                    />
                  </div>
                </details>
              </div>
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
