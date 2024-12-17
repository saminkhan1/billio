'use client'

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploaderProps {
  onUpload: (files: FileList) => void
  acceptedFileTypes?: string[]
  maxFileSize?: number
}

export function FileUploader({ 
  onUpload, 
  acceptedFileTypes = ['.pdf', '.jpg', '.png'], 
  maxFileSize = 5 * 1024 * 1024 
}: FileUploaderProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      onUpload(files)
    }
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="file-upload">Upload Documents</Label>
      <Input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        accept={acceptedFileTypes.join(',')}
        className="cursor-pointer"
      />
      <p className="text-xs text-muted-foreground">
        Maximum file size: {maxFileSize / (1024 * 1024)}MB. 
        Accepted formats: {acceptedFileTypes.join(', ')}
      </p>
    </div>
  )
} 