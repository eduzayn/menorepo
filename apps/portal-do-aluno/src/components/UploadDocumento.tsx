'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@edunexia/ui-components'
import { Upload } from '@edunexia/ui-components'
import { uploadDocumento } from '@/services/documentos'
import { documentoSchema, type DocumentoInput } from '@/schemas/documento'
import { useToast } from '@/hooks/use-toast'
import type { TipoDocumento } from '@/types/documentos'

const formSchema = z.object({
  tipo: z.enum(['RG', 'CPF', 'COMPROVANTE_RESIDENCIA', 'HISTORICO_ESCOLAR', 'DIPLOMA', 'OUTROS']),
  arquivo: z.instanceof(File)
})

interface UploadDocumentoProps {
  alunoId: string
  onSuccess?: () => void
}

export function UploadDocumento({ alunoId, onSuccess }: UploadDocumentoProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tipo: 'RG'
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsUploading(true)
      setError(null)
      await uploadDocumento(values.arquivo, values.tipo, alunoId)
      onSuccess?.()
    } catch (err) {
      setError('Erro ao fazer upload do documento. Tente novamente.')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de documento" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="RG">RG</SelectItem>
                  <SelectItem value="CPF">CPF</SelectItem>
                  <SelectItem value="COMPROVANTE_RESIDENCIA">Comprovante de Residência</SelectItem>
                  <SelectItem value="HISTORICO_ESCOLAR">Histórico Escolar</SelectItem>
                  <SelectItem value="DIPLOMA">Diploma</SelectItem>
                  <SelectItem value="OUTROS">Outros</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="arquivo"
          render={({ field: { onChange, value, ...field } }) => (
            <FormItem>
              <FormLabel>Arquivo</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      onChange(file)
                    }
                  }}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <Button type="submit" disabled={isUploading}>
          {isUploading ? 'Enviando...' : 'Enviar Documento'}
        </Button>
      </form>
    </Form>
  )
} 