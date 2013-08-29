MOCHA			= node_modules/mocha/bin/mocha

test:
	$(MOCHA) --reporter spec

deploy: test
	git push -u origin master
	npm publish

.PHONY: test
