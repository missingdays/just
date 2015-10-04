#
# Makefile
# missingdays, 2015-10-04 20:30
#

all:
	@echo "Makefile needs your attention"

examples: clean
	@node index.js examples/jst examples/js

clean:
	@rm -rf examples/js

# vim:ft=make
#
