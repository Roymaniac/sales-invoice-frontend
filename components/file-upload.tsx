"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Cloud, File, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function FileUpload() {
  const [files, setFiles] = React.useState<File[]>([])
  const [loading, setLoading] = React.useState(false)

  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...acceptedFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/*": [".png", ".jpg", ".jpeg"],
    },
  })

  const removeFile = (fileToRemove: File) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileToRemove.name))
  }

  return (
    <div className="grid gap-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer",
          isDragActive && "border-primary bg-secondary/20",
          "hover:border-primary hover:bg-secondary/20 transition-colors",
        )}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <Cloud className="h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Drag & drop files here, or click to select files</p>
          <p className="text-xs text-muted-foreground">Supports PDF, PNG, JPG up to 2MB</p>
        </div>
      </div>
      {files.length > 0 && (
        <div className="grid gap-2">
          {files.map((file) => (
            <div key={file.name} className="flex items-center gap-2 rounded-md border p-2">
              <File className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 text-sm">
                <p className="truncate font-medium">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)}MB</p>
              </div>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Button type="button" variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFile(file)}>
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

