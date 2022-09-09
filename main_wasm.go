package main

import (
	"syscall/js"

	"github.com/wa-lang/wa/api"
)

func main() {
	document := js.Global().Get("document")

	p := document.Call("createElement", "div")
	p.Set("id", "data")
	document.Get("body").Call("appendChild", p)

	data := js.Global().Get("document").Call("getElementById", "data")

	wat, err := api.BuildFile("hello.wa", code)
	if err != nil {
		data.Set("innerHTML", "ERROR: "+err.Error())
	} else {
		data.Set("innerHTML", "<pre>"+string(wat)+"</pre>")
	}
}

const code = `
fn main() {
	println(40+2)
}
`
