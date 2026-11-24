import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import type { MediaAsset } from '../types';
import {
  Image as ImageIcon,
  Upload,
  Search,
  Copy,
  Trash2,
  Check,
  Plus,
  Eye,
  X,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export const MediaLibraryTab: React.FC = () => {
  const { media, addMedia, deleteMedia, showToast } = useDashboard();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewAsset, setPreviewAsset] = useState<MediaAsset | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New asset form
  const [newName, setNewName] = useState('');
  const [newPath, setNewPath] = useState('');
  const [newCategory, setNewCategory] = useState<MediaAsset['category']>('product');

  // Filter media
  const filteredMedia = media.filter((m) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!m.name.toLowerCase().includes(q) && !m.path.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (selectedCategory !== 'all' && m.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const handleCopyPath = (path: string, name: string) => {
    navigator.clipboard.writeText(path);
    showToast(`Copied "${path}" to clipboard! Ready to paste into product form.`, 'success');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPath(event.target.result as string);
          if (!newName) {
            setNewName(file.name.replace(/\.[^/.]+$/, ''));
          }
          showToast(`File loaded ready to save`, 'info');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPath || !newName) {
      showToast('Please provide an image name and file/URL', 'error');
      return;
    }

    addMedia({
      name: newName,
      path: newPath,
      category: newCategory,
      size: 'Custom Asset',
      dimension: 'Standard HD',
      uploadedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewPath('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Media & Image Asset Library</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {filteredMedia.length} Assets
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Browse and manage all product photography, marketing banners, and Ayurvedic brand logos.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-800 to-emerald-700 hover:from-emerald-700 hover:to-emerald-600 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-950/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Image</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assets by file name or category..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-600 focus:outline-none"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'product', label: 'Products' },
            { id: 'banner', label: 'Banners' },
            { id: 'logo', label: 'Logos' },
            { id: 'marketing', label: 'Badges' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Media Gallery Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredMedia.map((asset) => (
          <div
            key={asset.id}
            className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-square bg-slate-50 overflow-hidden cursor-pointer">
              <img
                src={asset.path}
                alt={asset.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onClick={() => setPreviewAsset(asset)}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/vedayu-logo.png';
                }}
              />
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-white">
                  {asset.category}
                </span>
              </div>

              {/* Hover overlay with Quick Preview */}
              <div
                onClick={() => setPreviewAsset(asset)}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white"
              >
                <Eye className="w-5 h-5 drop-shadow" />
                <span className="text-xs font-bold">Preview</span>
              </div>
            </div>

            {/* Asset Metadata */}
            <div className="p-3 space-y-2">
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-xs truncate" title={asset.name}>
                  {asset.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate font-mono">{asset.path}</p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1">
                  <span>{asset.size}</span>
                  <span>{asset.dimension || '800x800'}</span>
                </div>
              </div>

              {/* Actions: Copy Path & Delete */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                <button
                  onClick={() => handleCopyPath(asset.path, asset.name)}
                  className="flex-1 py-1 px-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold transition-colors flex items-center justify-center gap-1"
                  title="Copy path to clipboard"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy Path</span>
                </button>
                <button
                  onClick={() => deleteMedia(asset.id)}
                  className="p-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Image Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white">{previewAsset.name}</h3>
                <p className="text-xs text-emerald-300 font-mono">{previewAsset.path}</p>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="max-h-[50vh] flex items-center justify-center bg-slate-50 rounded-2xl overflow-hidden border border-slate-200">
                <img
                  src={previewAsset.path}
                  alt={previewAsset.name}
                  className="max-h-[48vh] max-w-full object-contain"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <span className="text-slate-500">Image Path:</span>
                  <p className="font-mono font-bold text-slate-900 mt-0.5">{previewAsset.path}</p>
                </div>
                <button
                  onClick={() => handleCopyPath(previewAsset.path, previewAsset.name)}
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700 flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Image Path</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Upload Media Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-[#062417] to-[#0d3822] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Upload or Add Media Asset</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAsset} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Asset Title / Name *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Saffron Face Mist Gold"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Category Tag</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none"
                >
                  <option value="product">Product Photography</option>
                  <option value="banner">Store Banner / Hero</option>
                  <option value="logo">Brand Emblem / Logo</option>
                  <option value="marketing">Certificate Badge</option>
                </select>
              </div>

              {/* Upload or URL */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Image Source (File or URL)</label>
                <label className="w-full border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 p-4 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <Upload className="w-6 h-6 text-emerald-700 mb-1" />
                  <span className="text-xs font-bold text-emerald-900">Upload Image File</span>
                  <span className="text-[10px] text-emerald-700">JPG, PNG, WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Or Paste Image URL / Path</label>
                <input
                  type="text"
                  value={newPath}
                  onChange={(e) => setNewPath(e.target.value)}
                  placeholder="/images/products/new-item.jpg or https://..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono focus:outline-none"
                />
              </div>

              {newPath && (
                <div className="p-2 border border-slate-200 rounded-xl flex items-center space-x-2">
                  <img
                    src={newPath}
                    alt="Preview"
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <span className="text-[11px] text-slate-600 truncate">{newName || 'Image preview'}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-800 text-white font-bold rounded-xl hover:bg-emerald-700"
                >
                  Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
