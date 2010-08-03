[helvetictoc](helvetictoc.com)
===============
A time-full tribute to a timeless typeface.
-------------------------------------------

helvetictoc is my entry to the [10K apart contest](http://10k.aneventapart.com/).

It displays humanized time set in Helvetica.

Technical details:
-----------------

helveticloc doesn't rely on any external scripts.

It's however using [CommonJS modules](http://wiki.commonjs.org/wiki/Modules/1.1) which are concatenated using [modulr](http://github.com/codespeaks/modulr).

The JS source files (the modules) are found in `src` and concatenated to `js/main.js`.

This hopefully proves proper code organisation doesn't trump file size: the included modulr JS script is just above 3kb _before minification_.

The [src code](http://github.com/tobie/helvetictoc) is available on github.