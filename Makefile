build_examples:
	node scripts/build_examples.js

server:
	python3 -m http.server

dev-chai:
	node scripts/build_examples.js

	make -C ${HOME}/go/src/github.com/wa-lang/wa wa-js
	mv ${HOME}/go/src/github.com/wa-lang/wa/docs/wa-js/wa.wasm ./assets/wa-dev.wasm
	python3 -m http.server

clean:
	-rm ./assets/wa-dev.wasm
