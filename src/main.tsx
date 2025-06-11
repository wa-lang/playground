import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './tailwind.css'

loader.config({ monaco })

createRoot(document.getElementById('root')!).render(<App />)
