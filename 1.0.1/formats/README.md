Formats
=======
These regular expressions are to be loaded into the JSON validator and run
against any strings that specify one of these formats.

For example, the mbox schema specifies that the `mbox` property be formatted in
conformance with the `mailto-iri` regex:

    ...
        "mbox": {
            "type": "string",
            "format": "mailto-iri"
        }
    ...

If a format is specified in the schema but not defined in formats.json,
undefined behavior will result. What actually happens will depend on which, if
any, formats come pre-defined by your JSON validator library. In `tv4` for
example, no formats come predefined. If an undefined format is specified, it
will be ignored, and any string given for `mbox` will allow the test to pass.


Extending
---------
If a new format must be added, a new entry must be added to formats.json. This
is slightly difficult, because proper escaping must be applied to produce a
valid JSON representation of the regex. Here is a suggested technique, using
JavaScript in Node.js:

    // 1. Create the RegExp object:
    var any_three = /^...$/;

    // 2. Make and print the JSON string:
    console.log(JSON.stringify(any_three.source));

    // 3. You can then copy-paste the output into formats.json:
    //    ...
    //        "sha1": "^[0-9a-f]{40}$",
    //        "any_three": "^...$",
    //    ...


Notes on the patterns
---------------------
### `version`

    "^[0-9]+\\.[0-9]+\\.[0-9]+(?:-[0-9A-Za-z-]+)?$"

`<number> "." <number> "." <number> [ "-" ( <alphanumeric> | "-" )+ ]`

Quoting the API: "Starting with 1.0.0, xAPI will be versioned according to
[Semantic Versioning 1.0.0](http://semver.org/spec/v1.0.0.html)." This standard
requires a major version number, a minor version number AND a patch number.
Other specifiers may be appended.

### `uuid`

    "^[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}$"

Based on [RFC 4122](http://www.ietf.org/rfc/rfc4122.txt). Used in `statement`,
`statementref`, and `context`.

### `sha1`

    "^[0-9a-fA-F]{40}$"

40 hex digits. Used for `mbox_sha1sum`.

### `sha2`

    "^[0-9a-fA-F]{56}(?:[0-9a-fA-F]{8}(?:[0-9a-fA-F]{32}){0,2})?$"

Allows SHA-224 (permitted, not recommended), SHA-256, SHA-384 and SHA-512. Used
for `attachments`.

SHA-224: Each hex digit is 4 bits, so `224/4 = 56` hex digits are needed.

SHA-256: `256-224 = 32` more bits needed. `32/4 = 8` more hex digits than
SHA-224.

SHA-384: 128 more bits = 32 more hex digits.

SHA-512: 128 more bits = 32 more hex digits.

### `mimetype`
    "^[-\\w\\+\\.]+/[-\\w\\+\\.]+(?:;\\s*[-\\w\\+\\.]+=(?:(['\"]?)[-\\w\\+\\.]+\\1)|''|\"\")?$"

Specifies the data type. Used in `attachment`.

After examining http://www.freeformatter.com/mime-types-list.html, I determined
that every mimetype has two identifiers, separated by a single slash (/). Each
identifier may contain word characters, ".", "+" or "-".

Optionally, a parameter may be specified following ";" and whitespace, as in

    text/html; charset=utf-8

This consists of an identifier, followed by "=", followed by the (possibly
quoted) value.

### `mailto-uri`

A URI, consisting of "mailto:" followed by an email address. Superseded by
`mailto-iri`.

This was assembled from pieces of [JMRWare's URI regex](http://jmrware.com/articles/2009/uri_regexp/URI_regex.html). I sliced the
first and last characters off of his regexes so that I could combine them
without worrying about the anchors to the beginning and end of the string. I
also disallowed the empty string for the username and host.

    var user = new RegExp(
        '^' +
        re_js_rfc3986_userinfo.source.slice(1,-2) + '+' +   // '*' -> '+'
        '$'
    );
    var host = new RegExp(
        '^' +
        re_js_rfc3986_host.source.slice(1,-3) + '+)' +       // '*' -> '+'
        '$'
    );
    var email = new RegExp(
        '^' +
        '(?:' + user.source.slice(1,-1) + ')' +
        '@' +
        '(?:' + host.source.slice(1,-1) + ')' +
        '$'
    );
    var mailto_uri = new RegExp(
        '^' +
        'mailto:' +
        '(?:' + email.source.slice(1,-1) + ')' +
        '$'
    );
    console.log(JSON.stringify(mailto.source));

### `mailto-iri`

An IRI, consisting of "mailto:" followed by an email address. May contain
international characters. A handmade frankenstein of `mailto-uri` and `iri`.

### `iri`

Like a URI, but allows international characters. Requires a scheme, e.g. "http:"
at the beginning. Official definition is in
[RFC 3987](http://www.ietf.org/rfc/rfc3987.txt). Used in `verb`.

Modified from [Artefaria's IRI Reference regex](http://www.artefarita.com/journel/post/2013/05/23/An-IRI-pattern-for-Java).

### `iri-reference`

Like a URI Reference, but allows international characters. May be an IRI, or a
resolvable IRI fragment. Official definition is in [RFC 3987](http://www.ietf.org/rfc/rfc3987.txt). Taken from
[Artefaria's IRI Reference regex](http://www.artefarita.com/journel/post/2013/05/23/An-IRI-pattern-for-Java).

### `rfc3986-uri`

A URI, which contains only ASCII. Requires a scheme, e.g. "http:" at the
beginning. Official definition is in
[RFC 3986](http://www.ietf.org/rfc/rfc3986.txt). Used in `openid`.

Taken from
[JMRWare's URI regex](http://jmrware.com/articles/2009/uri_regexp/URI_regex.html).

I wanted to put this in `uri`, but this conflicts with
[json-schema.org's idea](http://json-schema.org/latest/json-schema-core.html#rfc.section.7.2.3) of
what a `uri` is, since they also allow things like
"#/definitions/positiveInteger" and "schema1" as URIs, which by the RFC are
invalid. Hence, their [metaschema](http://json-schema.org/schema) has a bug at
line 32:

    ...
            "id": {
                "type": "string",
                "format": "uri"     # << line 32
            },
    ...

There, "uri" has to be changed to "uri-reference". Also, tv4 will attempt to
verify "$ref" fields as `uri`, so tv4 also needs to be fixed. Until both of
these things are fixed, I cannot define `uri`, since the JSON metaschema from
http://json-schema.org/draft-04/schema won't verify itself.

### `rfc3986-uri-reference`

A URI Reference, which may be a URI, or a resolvable URI fragment. Taken from
[JMRWare's URI regex](http://jmrware.com/articles/2009/uri_regexp/URI_regex.html).

### `iso_date`

A date and time recorded in ISO 8601 format. Used in `statement_base`.

Taken from
http://stackoverflow.com/questions/21686539/regular-expression-for-full-iso-8601-date-syntax.

### `iso_duration`

A time duration recorded in ISO 8601 format. Used in `result`.

Also taken from
http://stackoverflow.com/questions/21686539/regular-expression-for-full-iso-8601-date-syntax.

### `langtag`

    "^(((([A-Za-z]{2,3}(-([A-Za-z]{3}(-[A-Za-z]{3}){0,2}))?)|[A-Za-z]{4}|[A-Za-z]{5,8})(-([A-Za-z]{4}))?(-([A-Za-z]{2}|[0-9]{3}))?(-([A-Za-z0-9]{5,8}|[0-9][A-Za-z0-9]{3}))*(-([0-9A-WY-Za-wy-z](-[A-Za-z0-9]{2,8})+))*(-(x(-[A-Za-z0-9]{1,8})+))?)|(x(-[A-Za-z0-9]{1,8})+)|((en-GB-oed|i-ami|i-bnn|i-default|i-enochian|i-hak|i-klingon|i-lux|i-mingo|i-navajo|i-pwn|i-tao|i-tay|i-tsu|sgn-BE-FR|sgn-BE-NL|sgn-CH-DE)|(art-lojban|cel-gaulish|no-bok|no-nyn|zh-guoyu|zh-hakka|zh-min|zh-min-nan|zh-xiang)))$"

Based on [RFC 5646](http://tools.ietf.org/html/rfc5646). Taken from
http://stackoverflow.com/questions/7035825/regular-expression-for-a-language-tag-as-defined-by-bcp47.

Thanks
------
* [Stackoverflow.com: Regular expression for full iso 8601 date syntax](http://stackoverflow.com/questions/21686539/regular-expression-for-full-iso-8601-date-syntax)
* [JMRWare.com: URI regex](http://jmrware.com/articles/2009/uri_regexp/URI_regex.html)
* [Stackoverflow.com: Regular expression for a language tag as defined by BCP47](http://stackoverflow.com/questions/7035825/regular-expression-for-a-language-tag-as-defined-by-bcp47)
* [Artefaria.com: An IRI pattern for Java](http://www.artefarita.com/journel/post/2013/05/23/An-IRI-pattern-for-Java)
