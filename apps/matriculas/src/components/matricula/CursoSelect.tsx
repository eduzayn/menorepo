import { useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@repo/ui-components/components/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@repo/ui-components/components/Command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui-components/components/Popover"
import { useQuery } from '@tanstack/react-query'
import { cursoService } from '@/services/cursoService'
import type { Curso, PlanoPagamento } from '@/types/matricula'

interface CursoSelectProps {
  value: string
  onChange: (value: string) => void
  onCursoChange?: (curso: Curso | null) => void
  onPlanoPagamentoChange?: (planos: PlanoPagamento[]) => void
}

export function CursoSelect({ 
  value, 
  onChange, 
  onCursoChange,
  onPlanoPagamentoChange 
}: CursoSelectProps) {
  const [open, setOpen] = useState(false)

  const { data: cursos = [], isLoading } = useQuery({
    queryKey: ['cursos'],
    queryFn: () => cursoService.listarCursos()
  })

  const selectedCurso = cursos.find((curso) => curso.id === value)

  const handleSelect = async (currentValue: string) => {
    if (currentValue === value) {
      onChange("")
      onCursoChange?.(null)
      onPlanoPagamentoChange?.([])
    } else {
      onChange(currentValue)
      const curso = cursos.find(c => c.id === currentValue) || null
      onCursoChange?.(curso)
      
      if (onPlanoPagamentoChange) {
        try {
          const planos = await cursoService.buscarPlanosPagamento(currentValue)
          onPlanoPagamentoChange(planos)
        } catch (error) {
          console.error('Erro ao buscar planos de pagamento:', error)
          onPlanoPagamentoChange([])
        }
      }
    }
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? selectedCurso?.nome
            : "Selecione um curso..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar curso..." />
          <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
          <CommandGroup>
            {cursos.map((curso) => (
              <CommandItem
                key={curso.id}
                value={curso.id}
                onSelect={handleSelect}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === curso.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {curso.nome}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 