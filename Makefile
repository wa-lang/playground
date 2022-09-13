default:
	GOOS=js GOARCH=wasm go build -o assets/wa.out.wasm
	python3 -m http.server
