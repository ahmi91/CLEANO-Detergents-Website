'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, Trash2, Copy, FolderOpen, Image as ImageIcon, Check, AlertTriangle, X, Grid, List } from 'lucide-react'

type MediaItem = {
  id: string
  filename: string
  url: string
  folder: string
  size: number
  type: string
  uploadedAt: string
  uploadedBy: string
}

const FOLDERS = ['general', 'products', 'banners', 'logos']

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function MediaClient({ initialMedia }: { initialMedia: MediaItem[] }) {
  const [media, setMedia] = useState(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [folder, setFolder] = useState('general')
  const [folderFilter, setFolderFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [dragOver, setDragOver] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 3000) }

  async function uploadFiles(files: FileList | File[]) {
    const fileArr = Array.from(files)
    setUploading(true)
    setUploadProgress(fileArr.map(f => f.name))

    const uploaded: MediaItem[] = []
    for (const file of fileArr) {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      try {
        const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
        if (res.ok) {
          const data = await res.json()
          uploaded.push(data.item)
        }
      } catch {}
    }

    setMedia(prev => [...uploaded, ...prev])
    setUploading(false)
    setUploadProgress([])
    if (uploaded.length > 0) showToast(`${uploaded.length} file${uploaded.length > 1 ? 's' : ''} uploaded!`)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) uploadFiles(e.dataTransfer.files)
  }

  async function deleteItem(id: string) {
    const res = await fetch('/api/admin/media', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ _action: 'delete', id }),
    })
    if (res.ok) { setMedia(prev => prev.filter(m => m.id !== id)); setDeleteConfirm(null); showToast('File deleted') }
  }

  function copyUrl(item: MediaItem) {
    const url = window.location.origin + item.url
    navigator.clipboard.writeText(url)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
    showToast('URL copied to clipboard!')
  }

  const filtered = media.filter(m => folderFilter === 'all' || m.folder === folderFilter)
  const isImage = (type: string) => type.startsWith('image/')

  return (
    <div className="space-y-5">
      {toast && <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-4 py-3 rounded-lg text-sm font-medium shadow-lg">{toast}</div>}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-display">Media Library</h1>
          <p className="text-gray-400 text-sm mt-0.5">{media.length} files · drag & drop to upload</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode(v => v === 'grid' ? 'list' : 'grid')}
            className="p-2 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
            {viewMode === 'grid' ? <List className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
          </button>
          <button onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Upload className="w-4 h-4" /> Upload
          </button>
          <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden"
            onChange={e => e.target.files && uploadFiles(e.target.files)} />
        </div>
      </div>

      {/* Upload folder + drop zone */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Folder select */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-xs text-gray-400 font-medium mb-3 uppercase tracking-wider">Upload to folder</p>
          <div className="space-y-1.5">
            {FOLDERS.map(f => (
              <button key={f} onClick={() => setFolder(f)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors capitalize ${folder === f ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                <FolderOpen className="w-3.5 h-3.5" /> {f}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        <div
          className={`lg:col-span-3 border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
            dragOver ? 'border-blue-500 bg-blue-950/30' : 'border-gray-700 hover:border-gray-600 bg-gray-900'
          } ${uploading ? 'opacity-60 cursor-not-allowed' : ''}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileInputRef.current?.click()}
        >
          {uploading ? (
            <>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-blue-400 font-medium">Uploading {uploadProgress.length} file{uploadProgress.length > 1 ? 's' : ''}...</p>
              <div className="mt-2 space-y-1">
                {uploadProgress.map((n, i) => <p key={i} className="text-xs text-gray-500">{n}</p>)}
              </div>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-white font-medium">Drop images here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">Uploading to: <span className="text-blue-400 capitalize">{folder}</span> · PNG, JPG, WebP, GIF</p>
            </>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {['all', ...FOLDERS].map(f => (
          <button key={f} onClick={() => setFolderFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${folderFilter === f ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'}`}>
            {f} {f === 'all' ? `(${media.length})` : `(${media.filter(m => m.folder === f).length})`}
          </button>
        ))}
      </div>

      {/* Gallery */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-600">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-700" />
          <p className="text-sm">No files uploaded yet. Drag & drop images above to get started.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(item => (
            <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden group hover:border-gray-700 transition-colors">
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                {isImage(item.type) ? (
                  <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FolderOpen className="w-8 h-8 text-gray-600" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button onClick={() => copyUrl(item)} className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-sm transition-colors">
                    {copiedId === item.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-white" />}
                  </button>
                  <button onClick={() => setDeleteConfirm(item.id)} className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg backdrop-blur-sm transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-white truncate" title={item.filename}>{item.filename}</p>
                <p className="text-xs text-gray-500 mt-0.5">{formatSize(item.size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] bg-gray-800 px-4 py-2.5 text-xs font-medium text-gray-400 uppercase tracking-wider gap-4">
            <div className="w-10">Preview</div>
            <div>Filename</div>
            <div>Folder</div>
            <div>Size</div>
            <div>Actions</div>
          </div>
          <div className="divide-y divide-gray-800/50">
            {filtered.map(item => (
              <div key={item.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] items-center px-4 py-3 gap-4 hover:bg-gray-800/30">
                <div className="w-10 h-10 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                  {isImage(item.type) ? (
                    <img src={item.url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><FolderOpen className="w-4 h-4 text-gray-600" /></div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{item.filename}</p>
                  <p className="text-xs text-gray-500 truncate font-mono">{item.url}</p>
                </div>
                <span className="text-xs text-gray-400 capitalize bg-gray-800 px-2 py-0.5 rounded">{item.folder}</span>
                <span className="text-xs text-gray-500">{formatSize(item.size)}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => copyUrl(item)} className="p-1.5 text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-red-950 rounded-lg transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-sm w-full">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="font-semibold text-white">Delete File?</h3>
                <p className="text-sm text-gray-400">This cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={() => deleteItem(deleteConfirm)} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg text-sm font-medium">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
