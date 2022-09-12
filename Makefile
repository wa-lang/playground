default:
	GOOS=js GOARCH=wasm go build -o web/wasm/wa.out.wasm
	python3 -m http.server
