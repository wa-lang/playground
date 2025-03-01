import { useConfigStore } from '@/stores/config'
import { Moon, Sun } from 'lucide-react'

export function ModeToggle() {
  const { actions: { updateTheme } } = useConfigStore()

  return (
    <div className="relative size-[1.2rem]">
      <Sun
        className="absolute h-full w-full rotate-0 scale-0 transition-all dark:rotate-0 dark:scale-100 cursor-pointer"
        onClick={() => updateTheme('light')}
      />
      <Moon
        className="absolute h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 cursor-pointer"
        onClick={() => updateTheme('dark')}
      />
    </div>
  )
}
