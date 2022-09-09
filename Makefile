default:
	GOOS=js GOARCH=wasm go build -o a.out.wasm
	python3 -m http.server
