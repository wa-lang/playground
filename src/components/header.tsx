import { Github, HomeIcon } from 'lucide-react'
import Logo from '../../public/logo.svg?react'
import { ModeToggle } from './ui/mode-toggle'

export function Header() {
  return (
    <header className="h-14 border-b flex items-center px-6 flex-shrink-0">
      <Logo className="w-6 h-6 mr-2" />
      <h1 className="text-lg font-semibold mr-auto">WA Playground</h1>
      <HomeIcon
        className="size-[1.2rem] mr-3 cursor-pointer"
        onClick={() => window.open('https://wa-lang.org', '_blank')}
      />
      <Github
        className="size-[1.2rem] mr-3 cursor-pointer"
        onClick={() => window.open('https://github.com/wa-lang/wa', '_blank')}
      />

      <ModeToggle />
    </header>
  )
}
