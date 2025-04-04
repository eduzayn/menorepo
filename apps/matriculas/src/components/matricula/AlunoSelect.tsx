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
import { alunoService } from '@/services/alunoService'
import type { Aluno } from '@/types/matricula'

interface AlunoSelectProps {
  value: string
  onChange: (value: string) => void
  onAlunoChange?: (aluno: Aluno | null) => void
}

export function AlunoSelect({ value, onChange, onAlunoChange }: AlunoSelectProps) {
  const [open, setOpen] = useState(false)

  const { data: alunos = [], isLoading } = useQuery({
    queryKey: ['alunos'],
    queryFn: () => alunoService.listarAlunos()
  })

  const selectedAluno = alunos.find((aluno) => aluno.id === value)

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
            ? selectedAluno?.nome
            : "Selecione um aluno..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Buscar aluno..." />
          <CommandEmpty>Nenhum aluno encontrado.</CommandEmpty>
          <CommandGroup>
            {alunos.map((aluno) => (
              <CommandItem
                key={aluno.id}
                value={aluno.id}
                onSelect={(currentValue: string) => {
                  onChange(currentValue === value ? "" : currentValue)
                  onAlunoChange?.(aluno)
                  setOpen(false)
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === aluno.id ? "opacity-100" : "opacity-0"
                  )}
                />
                {aluno.nome}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 