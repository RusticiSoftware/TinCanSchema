Tin Can Schema
==============

These folders contain the JSON schema for Tin Can API objects. They are 
designed to validate objects against the 
[Tin Can API specification](https://github.com/adlnet/xAPI-Spec).

A `formats` directory may be present. This contains Regular Expression strings
in JSON format to validate special strings like UUIDs, version numbers and 
URIs.

The schema are designed to be language-independent; the only requirements are

1. That the validator must 
   [support draft-4](http://www.json-schema.org/implementations.html) JSON 
   schema, and

2. That the validator has some way of registering Regular Expressions to 
   support the `format` field. This is not a hard requirement, but without this
   support, strings will not be verified for their format.
