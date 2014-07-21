Tin Can Schema
==========================

An in-progress JSON schema for the 1.0.0 Tin Can/Experience API standard.
Most JSON Schema processors will not handle everything (such as format uri),
but most things should work so long as the processor supports $ref.

One vagary: in order to get SubStatement working without repeating all
the statement rules, statements will allow the objectType property. This is
not actually legal, but it means SubStatements are fully validated. I'm still
pondering ways to deal with that.

TODO
----
* validate length of mbox_sha1sum
* language map keys -- really funky rules!
* objectType hack for statement/substatement improvement?
* duration validation
* timestamp/stored validation
* find out if there is a better way to handle the no additional agent properties thing
* find out why minItems and maxItems aren't validating

Thanks
------
* http://stackoverflow.com/questions/21686539/regular-expression-for-full-iso-8601-date-syntax
