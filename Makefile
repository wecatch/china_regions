pack_village:
	cd src && tar -czf village.tar.gz village.json
unpack_village:
	cd src && tar xvfz village.tar.gz