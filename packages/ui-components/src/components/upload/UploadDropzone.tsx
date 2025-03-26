import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Upload } from "lucide-react"

const uploadDropzoneVariants = cva(
  "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed bg-background p-8 text-center transition-colors hover:bg-muted/50",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/25",
        ghost: "border-0 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface UploadDropzoneProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof uploadDropzoneVariants> {
  onDrop?: (files: File[]) => void
  onRemove?: (file: File) => void
  accept?: string
  maxSize?: number
  multiple?: boolean
  value?: File[]
  error?: string
}

const UploadDropzone = React.forwardRef<HTMLDivElement, UploadDropzoneProps>(
  (
    {
      className,
      variant,
      onDrop,
      onRemove,
      accept,
      maxSize,
      multiple = true,
      value = [],
      error,
      ...props
    },
    ref
  ) => {
    const [isDragging, setIsDragging] = React.useState(false)
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragging(false)

      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) {
        onDrop?.(files)
      }
    }

    const handleClick = () => {
      inputRef.current?.click()
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        onDrop?.(files)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          uploadDropzoneVariants({ variant }),
          isDragging && "border-primary bg-primary/5",
          className
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
        {...props}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">
            Arraste e solte arquivos aqui ou clique para selecionar
          </p>
          <p className="text-xs text-muted-foreground">
            {accept
              ? `Tipos aceitos: ${accept}`
              : "Todos os tipos de arquivo são aceitos"}
          </p>
          {maxSize && (
            <p className="text-xs text-muted-foreground">
              Tamanho máximo: {maxSize / 1024 / 1024}MB
            </p>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

UploadDropzone.displayName = "UploadDropzone"

export { UploadDropzone, uploadDropzoneVariants } 