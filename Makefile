build_examples:
	node scripts/build_examples.js

server:
	python3 -m http.server

dev-chai:
	node scripts/build_examples.js

	make -C ${HOME}/go/src/github.com/wa-lang/wa/internal/app/wawasm
	mv ${HOME}/go/src/github.com/wa-lang/wa/docs/wa.wasm ./assets/wa-dev.wasm
	python3 -m http.server

clean:
	-rm ./assets/wa-dev.wasm
