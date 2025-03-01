export function formatMemory(buffer: ArrayBuffer, bytesPerRow: number = 4): { address: string, hex: string, ascii: string }[] {
  const bytes = new Uint8Array(buffer)
  const result: { address: string, hex: string, ascii: string }[] = []

  for (let i = 0; i < bytes.length; i += bytesPerRow) {
    const address = i.toString(16).padStart(8, '0')

    const rowBytes = bytes.slice(i, i + bytesPerRow)
    const hex = Array.from(rowBytes)
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ')

    const ascii = Array.from(rowBytes)
      .map(byte => (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : '.')
      .join('')

    result.push({
      address,
      hex,
      ascii,
    })
  }

  return result
}

export interface IMemoryValue {
  'Integer 8-bit': number
  'Integer 16-bit': number
  'Integer 32-bit': number
  'Integer 64-bit': bigint
  'Float 32-bit': number
  'Float 64-bit': number
  'Pointer 32-bit': number
  'Pointer 64-bit': bigint
}

export function getMemoryValue(
  buffer: ArrayBuffer,
  startIdx: number,
  isLittleEndian: boolean,
): IMemoryValue | null {
  if (!buffer)
    return null

  const uint8Array = new Uint8Array(buffer)
  const tempBuffer = new ArrayBuffer(8)
  const tempUint8Array = new Uint8Array(tempBuffer)
  const view = new DataView(tempBuffer)

  for (let i = 0; i < 8; i++) {
    if (startIdx + i < uint8Array.length) {
      tempUint8Array[i] = uint8Array[startIdx + i]
    }
  }

  try {
    return {
      'Integer 8-bit': view.getInt8(0),
      'Integer 16-bit': view.getInt16(0, isLittleEndian),
      'Integer 32-bit': view.getInt32(0, isLittleEndian),
      'Integer 64-bit': view.getBigInt64(0, isLittleEndian),
      'Float 32-bit': view.getFloat32(0, isLittleEndian),
      'Float 64-bit': view.getFloat64(0, isLittleEndian),
      'Pointer 32-bit': view.getUint32(0, isLittleEndian),
      'Pointer 64-bit': view.getBigInt64(0, isLittleEndian),
    }
  }
  catch {
    return null
  }
}
