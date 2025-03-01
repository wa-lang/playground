import type { FC } from 'react'
import { formatMemory, getMemoryValue } from '@/lib/memory'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'

interface IMemoryItem {
  address: string
  hex: string
  ascii: string
}

interface IMemoryCellProps {
  content: string
  isSelected: boolean
  onClick: () => void
}

const NUMBER_FORMAT_OPTIONS = {
  integer: ['dec', 'hex', 'oct'],
  float: ['dec', 'sci'],
} as const

const DEF_NUMBER_FORMATS = {
  'Integer 8-bit': 'hex',
  'Integer 16-bit': 'dec',
  'Integer 32-bit': 'hex',
  'Integer 64-bit': 'dec',
  'Float 32-bit': 'sci',
  'Float 64-bit': 'sci',
  'Pointer 32-bit': 'hex',
  'Pointer 64-bit': 'hex',
} as Record<string, string>

const MemoryCell = memo<IMemoryCellProps>(({ content, isSelected, onClick }) => (
  <span
    className={`cursor-pointer w-6 border px-1 ${isSelected ? 'bg-theme-foreground border-theme' : 'border-transparent'}`}
    onClick={onClick}
  >
    {content}
  </span>
))

const MemoryAddress = memo<{ address: string, isSelected: boolean }>(({ address, isSelected }) => (
  <div className={`w-24 border-r px-2 py-1 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`}>
    <span className="text-xs">{address}</span>
  </div>
))

const MemoryHex = memo<{
  hex: string
  rowIndex: number
  selectedRow: number | null
  selectedCol: number | null
  onCellClick: (row: number, col: number) => void
}>(({ hex, rowIndex, selectedRow, selectedCol, onCellClick }) => {
      const hexValues = useMemo(() => hex.split(' '), [hex])

      return (
        <div className="border-r px-2 py-1 flex gap-1 *:flex-1">
          {hexValues.map((hexValue, hexIndex) => {
            const isSelected = selectedRow === rowIndex && selectedCol === hexIndex
            const handleClick = useCallback(() => {
              onCellClick(rowIndex, hexIndex)
            }, [rowIndex, hexIndex, onCellClick])

            return (
              <MemoryCell
                key={hexIndex}
                content={hexValue.toUpperCase()}
                isSelected={isSelected}
                onClick={handleClick}
              />
            )
          })}
        </div>
      )
    })

const MemoryAscii = memo<{
  ascii: string
  rowIndex: number
  selectedRow: number | null
  selectedCol: number | null
  onCellClick: (row: number, col: number) => void
}>(({ ascii, rowIndex, selectedRow, selectedCol, onCellClick }) => {
      const asciiChars = useMemo(() => ascii.split(''), [ascii])

      return (
        <div className="w-28 px-2 py-1 text-muted-foreground flex gap-1">
          {asciiChars.map((char, charIndex) => {
            const isSelected = selectedRow === rowIndex && selectedCol === charIndex
            const handleClick = useCallback(() => {
              onCellClick(rowIndex, charIndex)
            }, [rowIndex, charIndex, onCellClick])

            return (
              <MemoryCell
                key={charIndex}
                content={char}
                isSelected={isSelected}
                onClick={handleClick}
              />
            )
          })}
        </div>
      )
    })

const MemoryRow = memo<{
  item: IMemoryItem
  rowIndex: number
  selectedRow: number | null
  selectedCol: number | null
  onCellClick: (row: number, col: number) => void
}>(({ item, rowIndex, selectedRow, selectedCol, onCellClick }) => (
      <div className={`flex text-xs text-center ${selectedRow === rowIndex ? 'bg-secondary/50' : ''}`}>
        <MemoryAddress
          address={item.address.toUpperCase()}
          isSelected={selectedRow === rowIndex}
        />
        <MemoryHex
          hex={item.hex}
          rowIndex={rowIndex}
          selectedRow={selectedRow}
          selectedCol={selectedCol}
          onCellClick={onCellClick}
        />
        <MemoryAscii
          ascii={item.ascii}
          rowIndex={rowIndex}
          selectedRow={selectedRow}
          selectedCol={selectedCol}
          onCellClick={onCellClick}
        />
      </div>
    ), (prevProps, nextProps) => {
      return (
        prevProps.item === nextProps.item
        && prevProps.rowIndex === nextProps.rowIndex
        && (prevProps.selectedRow === nextProps.selectedRow
          || (prevProps.rowIndex !== prevProps.selectedRow && nextProps.rowIndex !== nextProps.selectedRow))
        && (prevProps.selectedCol === nextProps.selectedCol
          || prevProps.rowIndex !== prevProps.selectedRow
          || nextProps.rowIndex !== nextProps.selectedRow)
        && prevProps.onCellClick === nextProps.onCellClick
      )
    })

export const MemoryPreview: FC = () => {
  const [memory, setMemory] = useState<IMemoryItem[]>([])
  const [selectedRow, setSelectedRow] = useState<number | null>(0)
  const [selectedCol, setSelectedCol] = useState<number | null>(0)
  const [isLittleEndian, setIsLittleEndian] = useState(true)
  const [numberFormats, setNumberFormats] = useState(DEF_NUMBER_FORMATS)

  useEffect(() => {
    if (!window.__WA_WASM__) {
      setMemory([])
      return
    }

    try {
      const buffer = window.__WA_WASM__
      const formattedMemory = formatMemory(buffer.slice(0, 1024))
      setMemory(formattedMemory)
    }
    catch (error) {
      console.error('Failed to get memory content:', error)
      setMemory([])
    }
  }, [])

  const handleCellClick = useCallback((row: number, col: number) => {
    setSelectedRow(prev => prev === row ? prev : row)
    setSelectedCol(prev => prev === col ? prev : col)
  }, [])

  const getValueAtSelection = useCallback(() => {
    if (selectedRow === null || selectedCol === null || !memory[selectedRow])
      return null

    const startIdx = selectedRow * 4 + selectedCol
    const buffer = window.__WA_WASM__
    if (!buffer)
      return null

    return getMemoryValue(buffer, startIdx, isLittleEndian)
  }, [selectedRow, selectedCol, memory, isLittleEndian])

  const endianValues = useMemo(() => getValueAtSelection(), [getValueAtSelection])

  const currentAddress = useMemo(() => {
    if (selectedRow === null || selectedCol === null)
      return '0x00000000'
    const address = (selectedRow * 4 + selectedCol)
    return `0x${address.toString(16).padStart(8, '0').toUpperCase()}`
  }, [selectedRow, selectedCol])

  const formatValue = useCallback((type: string, value: number | bigint | null) => {
    if (value === null)
      return 'N/A'

    if (type.startsWith('Pointer')) {
      return typeof value === 'bigint'
        ? `0x${value.toString(16)}`
        : `0x${value.toString(16)}`
    }

    if (type.startsWith('Float')) {
      const format = numberFormats[type as keyof typeof numberFormats]
      const num = Number(value)
      if (format === 'sci') {
        return num.toExponential(6)
      }
      return num.toFixed(2)
    }

    const format = numberFormats[type as keyof typeof numberFormats]
    switch (format) {
      case 'hex': return `0x${value.toString(16).toUpperCase()}`
      case 'oct': return `${value.toString(8)}`
      default: return value.toString()
    }
  }, [numberFormats])

  const memoryRows = useMemo(() => {
    return memory.map((item, rowIndex) => (
      <MemoryRow
        key={rowIndex}
        item={item}
        rowIndex={rowIndex}
        selectedRow={selectedRow}
        selectedCol={selectedCol}
        onCellClick={handleCellClick}
      />
    ))
  }, [memory, selectedRow, selectedCol, handleCellClick])

  return (
    <div className="flex h-full w-full">
      <div className="flex-1 overflow-auto flex flex-col">
        <div className="flex text-xs items-center justify-center bg-background border-b border-t-[2px] border-t-transparent p-2">
          <span className="text-center">{currentAddress}</span>
        </div>
        <div className="flex-1 overflow-auto mb-10 ">
          {memoryRows}
        </div>
      </div>

      <div className="w-64 border-l flex flex-col gap-2">
        <div className="flex gap-2 border-b p-1">
          <button
            className={`px-2 py-1 border text-xs ${isLittleEndian ? 'bg-theme-foreground border-theme' : 'bg-secondary border-transparent'}`}
            onClick={() => setIsLittleEndian(true)}
          >
            Little Endian
          </button>
          <button
            className={`px-2 py-1 border text-xs ${!isLittleEndian ? 'bg-theme-foreground border-theme' : 'bg-secondary border-transparent'}`}
            onClick={() => setIsLittleEndian(false)}
          >
            Big Endian
          </button>
        </div>
        <div className="space-y-2 text-xs p-2 overflow-auto">
          {endianValues && Object.entries(endianValues).map(([type, value]) => (
            <div key={type} className="space-y-1">
              <div className="flex justify-between items-center gap-2">
                <span className="w-24 text-muted-foreground flex-shrink-0">{type}</span>
                {!type.startsWith('Pointer') && (
                  <select
                    className="bg-secondary border border-transparent px-1 py-0.5 text-[10px] focus-visible:outline-none"
                    value={numberFormats[type as keyof typeof numberFormats]}
                    onChange={e => setNumberFormats(prev => ({
                      ...prev,
                      [type]: e.target.value,
                    }))}
                  >
                    {(type.startsWith('Float')
                      ? NUMBER_FORMAT_OPTIONS.float
                      : NUMBER_FORMAT_OPTIONS.integer
                    ).map(option => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}
              </div>
              <span className="text-left block">{formatValue(type, value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
