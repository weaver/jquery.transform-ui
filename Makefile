DEST= ../pages-jquery.transform-ui
publish:
	cp -RL example/* ${DEST}
	(cd ${DEST}; git add .; git commit -m 'publish'; git push origin gh-pages)