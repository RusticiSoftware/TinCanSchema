Tin Can Schema
==============
The folder(s) here contain JSON schema for Tin Can API objects. They are
used to validate objects against the
[Tin Can API specification](https://github.com/adlnet/xAPI-Spec).

The schema are designed to be language-independent; the only requirements are

1. That the validator must
   [support draft-4](http://www.json-schema.org/implementations.html) JSON
   schema, and

2. That the validator has some way of registering Regular Expressions to
   support the `format` field. This is not a hard requirement, but without this
   support, strings will not be verified for their format.

We are testing the schema using
[Tin Can Validator](https://github.com/RusticiSoftware/TinCanValidator).


Structure
---------
Each directory contains a complete set of parts that can be easily assembled
into a complete schema file.

A `formats` sub-directory may be present. This contains Regular Expression
strings in JSON format to validate special strings like UUIDs, version numbers
and URIs. These are not part of the schema itself, but must be registered with
the schema validator to enable string format checking.


### Build the schema (automatic)
You can use
[Tin Can Validator](https://github.com/RusticiSoftware/TinCanValidator) to do
this for you:

    git clone https://github.com/RusticiSoftware/TinCanValidator
    cd TinCanValidator
    ./joinSchema.js path/to/TinCanSchema/<version> result.json


### Build the schema (manual)
If you don't want to use that, follow these instructions:

    // 1. Make a skeleton:
    result = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        "type": "object",
        "additionalProperties": false,
        "properties": {}
    }

    // 2. For each JSON file:
    files = [ "account.json", "..." ]
    for (var i=0; i<files.length; i++) {
        var fname = files[i];

        // a. Parse it to an object and verify that it is valid JSON
        try {
            stringData = readFile(fname);
            data = JSON.parse(stringData);
        } catch (err) {
            // handle the error
        }

        // b. Check that the file name matches the id:
        if ("#" + fname.split('.')[0] !== data["id"]) {
            // handle the error
        }

        // c. Verify that the object is a valid schema:
        if (!YourValidator.validateSchema(data)) {
            // handle the error
        }

        // d. Remove the "$schema" field from the data, if present:
        if (data["$schema"]) delete data["$schema"];

        // e. Add the data to the "properties" field of the skeleton:
        id = data["id"].slice(1);  // slice off the '#' prefix
        result["properties"][id] = data;
    }

    // 3. Register the schema with your validator:
    YourValidator.addSchema("tcapi:<version>", result);

    // 4. Now to register the formats. Load and validate formats/formats.json:
    try {
        stringData = readFile("formats/formats.json");
        data = JSON.parse(stringData);
    } catch (err) {
        // handle the error
    }

    // 5. For each item in the data, make the Regex and register it with your validator:
    for (item in data.keys()) {
        rgx = new RegExp(data[item]);
        YourValidator.addFormat(item, rgx);
    }

    // 6. Now you can validate stuff!
    function validateAs(obj, id) {
        schema = { "$ref": "tcapi:<version>#" + id };
        YourValidator.validate(obj, schema);
    }

