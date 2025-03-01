const importsObject = {
  syscall_js: new (function (this: ISyscallJS) {
    this.print_bool = (v: boolean): void => {
      if (v) {
        window.__WA_PRINT__ += 'true'
      }
      else {
        window.__WA_PRINT__ += 'false'
      }
    }

    this.print_i32 = (i: number): void => {
      window.__WA_PRINT__ += i
    }

    this.print_u32 = (i: number): void => {
      window.__WA_PRINT__ += i
    }

    this.print_ptr = (i: number): void => {
      window.__WA_PRINT__ += i
    }

    this.print_i64 = (i: bigint): void => {
      window.__WA_PRINT__ += i
    }

    this.print_u64 = (i: bigint): void => {
      window.__WA_PRINT__ += i
    }

    this.print_f32 = (i: number): void => {
      window.__WA_PRINT__ += i
    }

    this.print_f64 = (i: number): void => {
      window.__WA_PRINT__ += i
    }

    this.print_rune = (c: number): void => {
      const ch = String.fromCodePoint(c)
      if (ch === '\n') {
        window.__WA_PRINT__ += '\n'
      }
      else {
        window.__WA_PRINT__ += ch
      }
    }

    this.print_str = (ptr: number, len: number): void => {
      const s = window.__WA_APP__.getString(ptr, len)
      window.__WA_PRINT__ += s
    }

    this.proc_exit = (_i: number): void => {
      // exit(i);
    }
  } as any)(),
}

export { importsObject }
