default:
	# GOOS=js GOARCH=wasm go build -o docs/assets/wa.out.wasm
	cd docs && python3 -m http.server
