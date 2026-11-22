import React, { useState, useEffect, useRef } from 'react';
import {
  FolderArchive,
  Upload,
  Search,
  Music,
  Volume2,
  Film,
  Camera,
  Tag,
  ShieldAlert,
  ShieldCheck,
  FileText,
  X,
} from 'lucide-react';
import { INITIAL_MEDIA_ASSETS } from '@/data/curatedMedia';
import {
  getAllAssets,
  saveAsset,
  deleteAsset as dbDeleteAsset,
} from '@/storage/indexedDb';
import { AssetCard } from '@/components/common/AssetCard';
import type { MediaAsset, MediaCategory } from '@/types/media';
import { useTheme } from '@/context/ThemeContext';

export const AssetLibraryPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewingAsset, setPreviewingAsset] = useState<MediaAsset | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<MediaCategory>('sfx');
  const [formLicenseName, setFormLicenseName] = useState('CC0 Public Domain');
  const [formCommercial, setFormCommercial] = useState(true);
  const [formAttributionReq, setFormAttributionReq] = useState(false);
  const [formAuthor, setFormAuthor] = useState('');
  const [formNotes, setFormNotes] = useState('');
  const [formTags, setFormTags] = useState('');
  const [stagedFile, setStagedFile] = useState<File | null>(null);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    const fromDb = await getAllAssets();
    if (fromDb.length === 0) {
      for (const asset of INITIAL_MEDIA_ASSETS) {
        await saveAsset(asset);
      }
      setAssets(INITIAL_MEDIA_ASSETS);
    } else {
      setAssets(fromDb);
    }
  };

  const categories: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'all', label: 'Tất cả tài nguyên', icon: FolderArchive },
    { id: 'music', label: 'Nhạc nền (BGM)', icon: Music },
    { id: 'sfx', label: 'Hiệu ứng SFX', icon: Volume2 },
    { id: 'footage', label: 'Footage', icon: Film },
    { id: 'cinematic', label: 'Cinematic', icon: Film },
    { id: 'nature', label: 'Thiên nhiên', icon: Camera },
    { id: 'background', label: 'Background', icon: Film },
    { id: 'image', label: 'Hình ảnh', icon: Camera },
    { id: 'other', label: 'Khác', icon: Tag },
  ];

  const filtered = assets.filter((asset) => {
    const matchesCat = selectedCat === 'all' || asset.category === selectedCat;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      asset.title.toLowerCase().includes(q) ||
      asset.filename.toLowerCase().includes(q) ||
      asset.tags.some((t) => t.toLowerCase().includes(q)) ||
      (asset.notes && asset.notes.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa tài nguyên này khỏi kho?')) {
      await dbDeleteAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      if (previewingAsset?.id === id) setPreviewingAsset(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStagedFile(file);
    setFormTitle(file.name.replace(/\.[a-z0-9]+$/i, ''));
    if (file.type.startsWith('video')) {
      setFormCategory('footage');
    } else if (file.type.startsWith('audio')) {
      setFormCategory('sfx');
    } else if (file.type.startsWith('image')) {
      setFormCategory('image');
    }
    setIsImportModalOpen(true);
  };

  const handleSaveImport = async () => {
    if (!stagedFile || !formTitle.trim()) return;

    const fileUrl = URL.createObjectURL(stagedFile);
    const newAsset: MediaAsset = {
      id: `asset-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: formTitle.trim(),
      filename: stagedFile.name,
      category: formCategory,
      url: fileUrl,
      fileSize: stagedFile.size,
      fileType: stagedFile.type || 'application/octet-stream',
      tags: formTags.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean),
      notes: formNotes.trim(),
      isFavorite: false,
      licenseInfo: {
        name: formLicenseName,
        creator: formAuthor.trim() || 'Tác giả cá nhân',
        sourceWebsite: 'Tệp nội bộ người dùng',
        attributionRequired: formAttributionReq,
        attributionText: formAttributionReq ? `Tài nguyên "${formTitle}" bởi ${formAuthor}` : undefined,
        commercialUse: formCommercial,
        downloadDate: Date.now(),
      },
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    await saveAsset(newAsset);
    setAssets((prev) => [newAsset, ...prev]);
    setIsImportModalOpen(false);
    setStagedFile(null);
    setFormTitle('');
    setFormNotes('');
    setFormTags('');
  };

  const missingLicenseCount = assets.filter((a) => !a.licenseInfo || !a.licenseInfo.name || a.licenseInfo.name.includes('Không rõ')).length;

  return (
    <div className="space-y-6 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 text-2xl font-extrabold">
            <div
              className={`p-2 rounded-xl ${
                isLight ? 'bg-purple-100 text-purple-700' : 'bg-purple-500/20 text-purple-400'
              }`}
            >
              <FolderArchive className="w-6 h-6" />
            </div>
            <h1>Kho Tài Nguyên Dựng Phim</h1>
          </div>
          <p className={`text-xs md:text-sm mt-1 ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
            Quản lý nhạc nền, hiệu ứng foley (SFX), footage b-roll và theo dõi bản quyền minh bạch.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95"
          >
            <Upload className="w-4 h-4" />
            <span>Thêm tệp từ máy tính</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {/* Warning banner */}
      {missingLicenseCount > 0 && (
        <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between text-xs text-amber-700 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0" />
            <span>
              Có <b>{missingLicenseCount}</b> tài nguyên chưa được kiểm chứng bản quyền.
            </span>
          </div>
        </div>
      )}

      {/* Category Tabs & Search Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((c) => {
            const Icon = c.icon;
            const count = c.id === 'all' ? assets.length : assets.filter((a) => a.category === c.id).length;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCat(c.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  selectedCat === c.id
                    ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                    : isLight
                    ? 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                    : 'bg-[#151222] border-[#262038] text-[#9B92A8] hover:text-[#F5F3FA]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{c.label}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search Bar */}
        <div
          className={`flex items-center justify-between gap-3 p-3 rounded-2xl border ${
            isLight ? 'bg-white border-zinc-200 shadow-xs' : 'bg-[#12101A] border-[#262038]'
          }`}
        >
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên file, tag (#whoosh, #4k), hoặc ghi chú..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none ${
                isLight
                  ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:border-purple-600 focus:bg-white'
                  : 'bg-[#171424] border-[#262038] text-[#F5F3FA] focus:border-purple-500'
              }`}
            />
          </div>
          <span className={`text-xs ${isLight ? 'text-zinc-500' : 'text-[#9B92A8]'}`}>
            Hiển thị <b>{filtered.length}</b> tài nguyên
          </span>
        </div>
      </div>

      {/* Asset Cards Grid */}
      {filtered.length === 0 ? (
        <div
          className={`text-center py-16 rounded-2xl border space-y-2 ${
            isLight ? 'bg-white border-zinc-200 text-zinc-500' : 'bg-[#151222] border-[#262038] text-[#6B627A]'
          }`}
        >
          <FolderArchive className="w-8 h-8 mx-auto text-zinc-400" />
          <h3 className="text-xs font-semibold">Không tìm thấy tài nguyên nào</h3>
          <p className="text-[11px]">Hãy thử chọn danh mục khác hoặc nhập tệp mới từ máy tính.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {filtered.map((asset) => (
            <AssetCard
              key={asset.id}
              asset={asset}
              onDelete={handleDelete}
              onPreview={(a) => setPreviewingAsset(a)}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewingAsset && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-3xl max-w-2xl w-full p-5 shadow-2xl space-y-4 ${
              isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#12101A] border-[#262038] text-[#F5F3FA]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#262038] pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-sm truncate max-w-sm">
                  {previewingAsset.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewingAsset(null)}
                className="p-1 text-zinc-400 hover:text-zinc-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media player box */}
            <div className="rounded-xl bg-zinc-950 p-3 flex items-center justify-center">
              {previewingAsset.fileType.includes('video') ? (
                <video
                  src={previewingAsset.url}
                  controls
                  autoPlay
                  className="max-h-60 w-full rounded-lg object-contain"
                />
              ) : (
                <div className="w-full space-y-2 py-3 text-center">
                  <Volume2 className="w-10 h-10 mx-auto text-purple-400" />
                  <audio src={previewingAsset.url} controls autoPlay className="w-full" />
                </div>
              )}
            </div>

            {/* License details */}
            <div
              className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#191625] border-[#262038]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Bản quyền &amp; Giấy phép:</span>
                </span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {previewingAsset.licenseInfo.commercialUse ? 'Được phép Thương mại' : 'Phi thương mại'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px]">
                <div>
                  <span className="text-zinc-400 block">Giấy phép:</span>
                  <span className="font-bold">{previewingAsset.licenseInfo.name}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Tác giả:</span>
                  <span>{previewingAsset.licenseInfo.creator || 'Chưa rõ'}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Nguồn:</span>
                  <span>{previewingAsset.licenseInfo.sourceWebsite}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Dung lượng:</span>
                  <span>{(previewingAsset.fileSize / (1024 * 1024)).toFixed(2)} MB</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && stagedFile && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className={`border rounded-3xl max-w-md w-full p-5 shadow-2xl space-y-3.5 text-xs ${
              isLight ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-[#12101A] border-[#262038] text-[#F5F3FA]'
            }`}
          >
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[#262038] pb-2.5">
              <h3 className="font-bold text-sm">Nhập Tài Nguyên Vào Kho</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-zinc-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-zinc-400 block mb-1">Tên hiển thị (*)</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className={`w-full p-2 rounded-xl border focus:outline-none ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#171424] border-[#262038]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="text-zinc-400 block mb-1">Danh mục</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as MediaCategory)}
                    className={`w-full p-2 rounded-xl border ${
                      isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#171424] border-[#262038]'
                    }`}
                  >
                    <option value="sfx">Hiệu ứng SFX</option>
                    <option value="music">Nhạc nền</option>
                    <option value="footage">Footage</option>
                    <option value="cinematic">Cinematic</option>
                    <option value="nature">Thiên nhiên</option>
                    <option value="background">Background</option>
                    <option value="image">Hình ảnh</option>
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1">Loại giấy phép</label>
                  <select
                    value={formLicenseName}
                    onChange={(e) => setFormLicenseName(e.target.value)}
                    className={`w-full p-2 rounded-xl border ${
                      isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#171424] border-[#262038]'
                    }`}
                  >
                    <option value="CC0 Public Domain">CC0 (Public Domain)</option>
                    <option value="Creative Commons CC-BY 4.0">CC-BY 4.0</option>
                    <option value="Pixabay Content License">Pixabay License</option>
                    <option value="Pexels License">Pexels License</option>
                    <option value="Tự tạo / Cá nhân">Tự tạo / Cá nhân</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Tác giả</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Tên kênh, tác giả..."
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className={`w-full p-2 rounded-xl border ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#171424] border-[#262038]'
                  }`}
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Thẻ phân loại</label>
                <input
                  type="text"
                  placeholder="whoosh, transition, cinematic..."
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  className={`w-full p-2 rounded-xl border ${
                    isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-[#171424] border-[#262038]'
                  }`}
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-[#262038]">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 text-zinc-400 hover:text-zinc-700"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveImport}
                className="px-4 py-1.5 rounded-xl bg-purple-600 text-white font-medium hover:bg-purple-700"
              >
                Lưu vào kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
