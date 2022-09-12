package main

import (
	"syscall/js"

	"github.com/wa-lang/wa/api"
)

func main() {
	window := js.Global().Get("window")
	waCode := window.Get("waCode").String()

	wat, err := api.BuildFile("hello.wa", waCode, "wasm32-wa")
	if err != nil {
		window.Set("waWat", nil)
	} else {
		window.Set("waWat", string(wat))
	}

}
