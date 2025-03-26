import { useState, useCallback } from 'react'
import { QuizBlock as QuizBlockType, QuizQuestion } from '@/types/editor'
import { Button } from '@edunexia/ui-components'
import { Input } from '@edunexia/ui-components'
import { Textarea } from '@edunexia/ui-components'
import { Trash2, Plus, Minus } from 'lucide-react'

interface QuizBlockProps {
  block: QuizBlockType
  onUpdate: (blockId: string, updates: Partial<QuizBlockType>) => void
  onDelete: (blockId: string) => void
}

export function QuizBlock({ block, onUpdate, onDelete }: QuizBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(block.title || '')
  const [description, setDescription] = useState(block.description || '')
  const [questions, setQuestions] = useState<QuizQuestion[]>(block.questions || [])

  const handleSave = useCallback(() => {
    setIsEditing(false)
    onUpdate(block.id, {
      title,
      description,
      questions,
    })
  }, [block.id, title, description, questions, onUpdate])

  const handleAddQuestion = useCallback(() => {
    setQuestions([
      ...questions,
      {
        id: Math.random().toString(36).substr(2, 9),
        text: '',
        options: [''],
        correctOption: 0,
      },
    ])
  }, [questions])

  const handleRemoveQuestion = useCallback((questionId: string) => {
    setQuestions(questions.filter((q) => q.id !== questionId))
  }, [questions])

  const handleUpdateQuestion = useCallback((questionId: string, updates: Partial<QuizQuestion>) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId ? { ...q, ...updates } : q
      )
    )
  }, [questions])

  const handleAddOption = useCallback((questionId: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? { ...q, options: [...q.options, ''] }
          : q
      )
    )
  }, [questions])

  const handleRemoveOption = useCallback((questionId: string, optionIndex: number) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.filter((_, i) => i !== optionIndex),
              correctOption:
                q.correctOption === optionIndex
                  ? 0
                  : q.correctOption > optionIndex
                  ? q.correctOption - 1
                  : q.correctOption,
            }
          : q
      )
    )
  }, [questions])

  if (isEditing) {
    return (
      <div className="rounded-lg border p-4">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              placeholder="Digite o título do quiz"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              placeholder="Digite uma descrição para o quiz"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Questões</h3>
              <Button onClick={handleAddQuestion}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Questão
              </Button>
            </div>

            {questions.map((question, questionIndex) => (
              <div key={question.id} className="rounded-lg border p-4">
                <div className="mb-4">
                  <label className="text-sm font-medium">
                    Questão {questionIndex + 1}
                  </label>
                  <Textarea
                    value={question.text}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      handleUpdateQuestion(question.id, { text: e.target.value })
                    }
                    placeholder="Digite a questão"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Opções</label>
                  {question.options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleUpdateQuestion(question.id, {
                            options: question.options.map((o, i) =>
                              i === optionIndex ? e.target.value : o
                            ),
                          })
                        }
                        placeholder={`Opção ${optionIndex + 1}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveOption(question.id, optionIndex)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => handleAddOption(question.id)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Opção
                  </Button>
                </div>

                <div className="mt-4">
                  <label className="text-sm font-medium">Resposta Correta</label>
                  <select
                    value={question.correctOption}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleUpdateQuestion(question.id, {
                        correctOption: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  >
                    {question.options.map((_, index) => (
                      <option key={index} value={index}>
                        Opção {index + 1}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  variant="ghost"
                  className="mt-4"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Remover Questão
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Salvar</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="group relative rounded-lg border p-4">
      <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(true)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(block.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {title && (
        <h3 className="mb-2 text-lg font-medium">{title}</h3>
      )}

      {description && (
        <p className="mb-4 text-sm text-muted-foreground">
          {description}
        </p>
      )}

      <div className="space-y-4">
        {questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border p-4">
            <h4 className="mb-2 font-medium">
              Questão {index + 1}
            </h4>
            <p className="mb-4">{question.text}</p>
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div
                  key={optionIndex}
                  className={`rounded-md p-2 ${
                    optionIndex === question.correctOption
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 