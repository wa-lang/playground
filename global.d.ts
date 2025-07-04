declare global {
  class Go {
    importObject: WebAssembly.Imports
    run(instance: WebAssembly.Instance): Promise<void>
    init(wasmInst: any): void
  }

  interface Window {
    __WA_WASM__: ArrayBuffer
    __WA_WAT__: string
    __WA_CODE__: string
    __WA_PRINT__: string
    __WA_ERROR__: string
    __WA_FMT_CODE__: string
    __WA_APP__: {
      getString: (ptr: number, len: number) => string
      init: (wasmInst: any) => void
    }
    Go: typeof Go
  }
  interface ISyscallJS {
    print_bool: (v: boolean) => void
    print_i32: (i: number) => void
    print_u32: (i: number) => void
    print_ptr: (i: number) => void
    print_i64: (i: bigint) => void
    print_u64: (i: bigint) => void
    print_f32: (i: number) => void
    print_f64: (i: number) => void
    print_rune: (c: number) => void
    print_str: (ptr: number, len: number) => void
    print_position: (v: number) => void
    proc_exit: (i: number) => void
  }
}

export {}
