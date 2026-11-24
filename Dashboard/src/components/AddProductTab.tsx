import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { Product } from '../types';
import {
  Plus,
  Upload,
  Image as ImageIcon,
  Sparkles,
  Check,
  Percent,
  TrendingUp,
  Tag,
  ShieldCheck,
  AlertCircle,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const AddProductTab: React.FC = () => {
  const { categories, media, addProduct, setActiveTab, showToast } = useDashboard();

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || 'Ayurvedic Health Products');
  const [categorySlug, setCategorySlug] = useState(categories[0]?.slug || 'ayurvedic-products');
  const [subCategory, setSubCategory] = useState('');
  const [price, setPrice] = useState<number>(399);
  const [mrp, setMrp] = useState<number>(499);
  const [costPrice, setCostPrice] = useState<number>(180);
  const [stockCount, setStockCount] = useState<number>(100);
  const [sizeWeight, setSizeWeight] = useState('200g');
  const [dosageForm, setDosageForm] = useState('Powder');
  const [dosha, setDosha] = useState<string[]>(['Vata', 'Pitta']);
  const [image, setImage] = useState('/images/products/ashwagandha-powder.jpg');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [usageInstructions, setUsageInstructions] = useState('');
  const [benefitsInput, setBenefitsInput] = useState('Boosts natural vitality and immunity\nPromotes calm mind and restorative sleep\nRejuvenates internal tissues (Dhatus)');
  const [highlightsInput, setHighlightsInput] = useState('100% Certified Ayurvedic Organic\nZero Artificial Preservatives\nLab Tested for Heavy Metals\nHigh Bio-active Potency');
  const [certificationsInput, setCertificationsInput] = useState('GMP Certified, AYUSH Approved, Non-GMO, 100% Natural');
  const [ingredientName, setIngredientName] = useState('Pure Organic Herbal Extract');
  const [ingredientPct, setIngredientPct] = useState('100%');
  const [isFeatured, setIsFeatured] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(true);

  // Auto-generate slug when name changes
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '')
    );
  };

  // Category select change
  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedSlug = e.target.value;
    const found = categories.find((c) => c.slug === selectedSlug);
    if (found) {
      setCategory(found.name);
      setCategorySlug(found.slug);
    }
  };

  // Dosha toggle
  const toggleDosha = (d: string) => {
    setDosha((prev) => (prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]));
  };

  // Profit and discount live calculations
  const discountPct = mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const unitProfit = price - costPrice;
  const marginPct = price > 0 ? Math.round((unitProfit / price) * 100) : 0;

  // File upload preview
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
          showToast(`Image loaded for preview`, 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      showToast('Please enter a product title', 'error');
      return;
    }

    if (price <= 0 || mrp <= 0) {
      showToast('Please enter valid pricing details', 'error');
      return;
    }

    const benefits = benefitsInput
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const highlights = highlightsInput
      .split('\n')
      .map((h) => h.trim())
      .filter(Boolean);

    const certifications = certificationsInput
      .split(',')
      .map((c) => c.trim())
      .filter(Boolean);

    const newProd = addProduct({
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      category,
      categorySlug,
      subCategory: subCategory || undefined,
      tagline: tagline || 'Pure Authentic Ayurvedic Formulation',
      price,
      mrp,
      costPrice,
      rating: 5.0,
      reviewCount: 1,
      inStock: stockCount > 0,
      stockCount,
      image: image || '/images/products/ashwagandha-powder.jpg',
      images: [image, ...additionalImages].filter(Boolean),
      sizeWeight,
      dosageForm,
      dosha: dosha.length > 0 ? dosha : ['Tridoshic'],
      benefits: benefits.length > 0 ? benefits : ['Rejuvenates body mind and spirit'],
      ingredients: [{ name: ingredientName || 'Pure Botanical Extract', percentage: ingredientPct || '100%' }],
      usageInstructions: usageInstructions || 'Take 1 to 2 units daily with warm water or milk as directed by an Ayurvedic physician.',
      description: description || `${name} is formulated following sacred Charaka Samhita wisdom, using wild-crafted herbs to restore physiological harmony.`,
      highlights: highlights.length > 0 ? highlights : ['100% Herbal', 'GMP Certified'],
      certifications: certifications.length > 0 ? certifications : ['GMP', 'AYUSH Approved'],
      isFeatured,
      isBestseller,
      isNewArrival,
    });

    setActiveTab('products');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Add New Ayurvedic Formulation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Publish a new product to your Vedayu Amrit store catalog with inventory and pricing.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('products')}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors self-start"
        >
          Cancel & Return to Catalog
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left & Middle: Form Fields (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" /> Basic Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">
                  Product Name / Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={handleNameChange}
                  placeholder="e.g. Pure Himalayan Shilajit Gold Resin"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="himalayan-shilajit-resin"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={categorySlug}
                  onChange={handleCategorySelect}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-700">Tagline / Short Hook</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. 100% Purified Grade A Himalayan Resin for Peak Stamina & Vitality"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing, Cost & Live Profit Margin */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-600" /> Pricing & Profit Margin Analysis
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Calculation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Selling Price (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  MRP (Maximum Retail Price ₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="1"
                    value={mrp}
                    onChange={(e) => setMrp(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Estimated Unit Cost / COGS (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                  <input
                    type="number"
                    min="0"
                    value={costPrice}
                    onChange={(e) => setCostPrice(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-2 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Profit Margin Widget */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950 via-[#0a2e1d] to-emerald-900 text-white flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] text-emerald-300 font-medium">Estimated Gross Profit Per Unit</p>
                <p className="text-2xl font-black text-amber-300 tracking-tight">₹{unitProfit}</p>
              </div>
              <div className="flex items-center space-x-6 text-xs">
                <div>
                  <p className="text-emerald-300/80">Customer Discount</p>
                  <p className="font-bold text-white text-base">{discountPct}% OFF</p>
                </div>
                <div>
                  <p className="text-emerald-300/80">Net Profit Margin</p>
                  <p className="font-bold text-emerald-400 text-base">{marginPct}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Inventory, Dosage & Ayurvedic Doshas */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-emerald-600" /> Inventory & Ayurvedic Attributes
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Initial Stock Units</label>
                <input
                  type="number"
                  min="0"
                  value={stockCount}
                  onChange={(e) => setStockCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Net Size / Weight</label>
                <input
                  type="text"
                  value={sizeWeight}
                  onChange={(e) => setSizeWeight(e.target.value)}
                  placeholder="e.g. 200g, 500ml, 60 Veg Capsules"
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Dosage Form</label>
                <select
                  value={dosageForm}
                  onChange={(e) => setDosageForm(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="Powder">Powder (Churna)</option>
                  <option value="Capsule">Vegetarian Capsule</option>
                  <option value="Juice">Cold Pressed Juice</option>
                  <option value="Oil">Taila / Herbal Oil</option>
                  <option value="Paste">Avaleha / Paste (Chyawanprash)</option>
                  <option value="Cream">Herbal Cream / Gel</option>
                  <option value="Seeds">Whole Raw Seeds</option>
                  <option value="Drops">Concentrated Drops</option>
                  <option value="Mist">Botanical Mist</option>
                </select>
              </div>
            </div>

            {/* Dosha Selector Checkboxes */}
            <div className="pt-2">
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Ayurvedic Dosha Suitability
              </label>
              <div className="flex flex-wrap gap-2.5">
                {['Vata', 'Pitta', 'Kapha'].map((d) => {
                  const isSelected = dosha.includes(d);
                  return (
                    <button
                      type="button"
                      key={d}
                      onClick={() => toggleDosha(d)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                      <span>{d} Dosha</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Store Badges Checkboxes */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs font-medium text-slate-700">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
                <span>Feature on Homepage</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
                <span>Mark as Bestseller</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="rounded text-emerald-700 focus:ring-emerald-600 w-4 h-4"
                />
                <span>New Arrival Badge</span>
              </label>
            </div>
          </div>

          {/* Card 4: Description, Ingredients, and Benefits */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Formulation Description & Benefits
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Detailed Ayurvedic Description
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the classical formulation, harvest purity, processing methods, and traditional healing rationale..."
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Key Benefits (one per line)
                </label>
                <textarea
                  rows={3}
                  value={benefitsInput}
                  onChange={(e) => setBenefitsInput(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Usage Instructions & Anupana
                </label>
                <textarea
                  rows={3}
                  value={usageInstructions}
                  onChange={(e) => setUsageInstructions(e.target.value)}
                  placeholder="e.g. 1 teaspoon twice daily with warm milk or honey before bed."
                  className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image Selection & Real-Time Product Preview Card (1 col) */}
        <div className="space-y-6">
          {/* Image Selector Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-emerald-600" /> Product Image & Gallery
            </h3>

            {/* Quick Select from Store Assets */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Select from Brand Assets
              </label>
              <select
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
              >
                {media.slice(0, 20).map((m) => (
                  <option key={m.id} value={m.path}>
                    {m.name} ({m.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Manual Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Or Image URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="/images/products/ashwagandha-powder.jpg"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-mono focus:bg-white focus:border-emerald-600 focus:outline-none"
              />
            </div>

            {/* Upload File Button */}
            <div>
              <label className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                <Upload className="w-6 h-6 text-emerald-700 mb-1" />
                <span className="text-xs font-bold text-emerald-900">Upload Product Image</span>
                <span className="text-[10px] text-emerald-700">PNG, JPG, WEBP up to 5MB</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Real-Time Live Preview Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" /> Storefront Preview
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
                Interactive Mockup
              </span>
            </div>

            {/* Render Mock Card */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="relative aspect-square bg-slate-100 overflow-hidden">
                <img
                  src={image || '/images/products/ashwagandha-powder.jpg'}
                  alt={name || 'Product'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/vedayu-logo.png';
                  }}
                />
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                  {isBestseller && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-slate-950">
                      Bestseller
                    </span>
                  )}
                  {isNewArrival && (
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-emerald-800 text-white">
                      New Launch
                    </span>
                  )}
                </div>

                <div className="absolute top-2.5 right-2.5">
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-emerald-800 border border-emerald-200">
                    {stockCount > 0 ? `${stockCount} in stock` : 'Out of stock'}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-1.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  {category}
                </p>
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {name || 'Product Title Goes Here'}
                </h4>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {tagline || '100% Pure Organic Ayurvedic Formulation.'}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-base font-black text-slate-900">₹{price}</span>
                    {mrp > price && (
                      <span className="text-xs text-slate-400 line-through ml-1.5">
                        ₹{mrp}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {dosha.map((d) => (
                      <span
                        key={d}
                        className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Publish Action Button */}
          <div className="space-y-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/20 transition-all flex items-center justify-center gap-2 transform active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>Publish Product to Store</span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              Formulation will instantly appear on catalog and storefront.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
