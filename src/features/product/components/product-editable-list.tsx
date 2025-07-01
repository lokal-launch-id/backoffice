import { FC, useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

interface EditableListProps {
  label: string
  items: string[]
  onChange: (items: string[]) => void
  isEditing: boolean
  inputPlaceholder?: string
}

export const EditableList: FC<EditableListProps> = ({
  label,
  items,
  onChange,
  isEditing,
  inputPlaceholder,
}) => {
  const [input, setInput] = useState('')
  return (
    <div>
      <FormLabel>{label}</FormLabel>
      {isEditing && (
        <div className='my-2 flex gap-2'>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder || `Add ${label.toLowerCase()}`}
            disabled={!isEditing}
          />
          <Button
            type='button'
            onClick={() => {
              if (input.trim()) {
                onChange([...items, input.trim()])
                setInput('')
              }
            }}
            disabled={!input.trim()}
          >
            Add
          </Button>
        </div>
      )}
      <ul className='list-inside list-disc space-y-1'>
        {items.map((item, idx) => (
          <li key={idx} className='flex items-center gap-2'>
            <span>{item}</span>
            {isEditing && (
              <Button
                type='button'
                size='icon'
                variant='ghost'
                onClick={() => {
                  const updated = items.filter((_, i) => i !== idx)
                  onChange(updated)
                }}
              >
                <IconX size={14} />
              </Button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
