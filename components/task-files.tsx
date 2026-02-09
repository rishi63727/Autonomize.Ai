'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Icons } from '@/components/icons'

interface File {
  id: string
  name: string
  size: number
  url: string
  uploadedAt: string
}

interface TaskFilesProps {
  taskId: string
}

export function TaskFiles({ taskId }: TaskFilesProps) {
  const [files, setFiles] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useState<HTMLInputElement | null>(null)[1]

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}/files`)
        if (response.ok) {
          const data = await response.json()
          setFiles(data.files || [])
        }
      } catch (error) {
        console.error('Failed to fetch files:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFiles()
  }, [taskId])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.currentTarget.files
    if (!selectedFiles || selectedFiles.length === 0) return

    setIsUploading(true)

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`/api/tasks/${taskId}/files`, {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setFiles([...files, data.file])
        }
      }
    } catch (error) {
      console.error('Failed to upload file:', error)
    } finally {
      setIsUploading(false)
      if (e.currentTarget) {
        e.currentTarget.value = ''
      }
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm('Delete this file?')) return

    try {
      const response = await fetch(`/api/tasks/${taskId}/files/${fileId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFiles(files.filter(f => f.id !== fileId))
      }
    } catch (error) {
      console.error('Failed to delete file:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.file className="h-5 w-5" />
          Files
        </CardTitle>
        <CardDescription>
          {files.length} file{files.length !== 1 ? 's' : ''}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:bg-accent/50 transition-colors">
          <input
            ref={fileInputRef as any}
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Icons.upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium">
                  {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-sm text-muted-foreground">
                  PNG, JPG, PDF, DOC up to 10MB
                </p>
              </div>
            </div>
          </label>
        </div>

        {/* Files List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Icons.spinner className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : files.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No files uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icons.file className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-primary hover:underline truncate"
                    >
                      {file.name}
                    </a>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={file.url}
                    download
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Icons.download className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteFile(file.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Icons.delete className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
