'use client'

import { useState, useRef } from 'react'
import { Upload, X, FileText, File as FileIcon, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface UploadedFile {
  asset_id: string
  file_name: string
  file_size?: number
  success: boolean
}

interface DocumentUploadProps {
  onUploadComplete?: (assetIds: string[], files: UploadedFile[]) => void
  onFilesChange?: (files: File[]) => void
  maxFiles?: number
  accept?: string
  className?: string
  label?: string
}

export function DocumentUpload({
  onUploadComplete,
  onFilesChange,
  maxFiles = 5,
  accept = '.pdf,.jpg,.jpeg,.png,.doc,.docx,.txt',
  className,
  label = 'Upload Supporting Documents'
}: DocumentUploadProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addFiles(files)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const addFiles = (newFiles: File[]) => {
    const remainingSlots = maxFiles - selectedFiles.length
    if (remainingSlots <= 0) {
      setUploadStatus({ type: 'error', message: `Maximum ${maxFiles} files allowed` })
      setTimeout(() => setUploadStatus(null), 3000)
      return
    }

    const filesToAdd = newFiles.slice(0, remainingSlots)
    const updatedFiles = [...selectedFiles, ...filesToAdd]
    setSelectedFiles(updatedFiles)
    onFilesChange?.(updatedFiles)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadStatus({ type: 'error', message: 'No files selected' })
      setTimeout(() => setUploadStatus(null), 3000)
      return
    }

    setUploading(true)
    setUploadStatus({ type: 'info', message: 'Uploading files...' })

    try {
      const formData = new FormData()
      selectedFiles.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        setUploadedFiles(result.files)
        setUploadStatus({
          type: 'success',
          message: `Successfully uploaded ${result.successful_uploads} file(s)`
        })
        onUploadComplete?.(result.asset_ids, result.files)
        setSelectedFiles([])
        setTimeout(() => setUploadStatus(null), 5000)
      } else {
        setUploadStatus({
          type: 'error',
          message: result.message || 'Upload failed'
        })
        setTimeout(() => setUploadStatus(null), 5000)
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        type: 'error',
        message: 'Failed to upload files. Please try again.'
      })
      setTimeout(() => setUploadStatus(null), 5000)
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    if (ext === 'pdf') return <FileText className="w-5 h-5 text-red-500" />
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext || '')) return <FileIcon className="w-5 h-5 text-blue-500" />
    if (['doc', 'docx'].includes(ext || '')) return <FileText className="w-5 h-5 text-blue-600" />
    return <FileIcon className="w-5 h-5 text-gray-500" />
  }

  return (
    <div className={cn('space-y-4', className)}>
      <h4 className="text-sm font-medium text-gray-700">{label}</h4>

      {/* Upload Status Notification */}
      {uploadStatus && (
        <div className={cn(
          'p-3 rounded-md text-sm',
          uploadStatus.type === 'success' && 'bg-green-50 text-green-800 border border-green-200',
          uploadStatus.type === 'error' && 'bg-red-50 text-red-800 border border-red-200',
          uploadStatus.type === 'info' && 'bg-blue-50 text-blue-800 border border-blue-200'
        )}>
          {uploadStatus.message}
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50',
          uploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Upload className="w-10 h-10 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600">
          {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Supports PDF, Images, Word documents (Max {maxFiles} files)
        </p>
      </div>

      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Selected Files ({selectedFiles.length}/{maxFiles})
          </p>
          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.name)}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  disabled={uploading}
                  className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <Button
            onClick={uploadFiles}
            disabled={uploading}
            className="w-full"
            style={{ backgroundColor: '#EC4899' }}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-green-700">
            Uploaded Files ({uploadedFiles.length})
          </p>
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-md">
                <div className="flex items-center gap-3">
                  {getFileIcon(file.file_name)}
                  <div>
                    <p className="text-sm font-medium text-green-800">{file.file_name}</p>
                    <p className="text-xs text-green-600">Asset ID: {file.asset_id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
