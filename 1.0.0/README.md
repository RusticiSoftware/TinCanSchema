Tin Can Schema
==========================

An in-progress JSON schema for the 1.0.0 Tin Can/Experience API standard. It is being tested using https://github.com/chaimleib-scorm/TinCanValidator.

Build the schema
----------------
You can use https://github.com/chaimleib-scorm/TinCanValidator to do this for you.

If you don't want to use that, follow these instructions:

The JSON files on the root level of this directory were designed to be joined together in a single schema object. To create this object:

1. Make a skeleton:
```
result = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "additionalProperties": false,
    "properties": {}
}
```

2. For each JSON file:

    a. Parse it to an object and verify that it is valid JSON
```
fname = "account.json";
try {
    stringData = readFile(fname);
    data = JSON.parse(stringData);
} catch (err) {
    // handle the error
}
```
    b. Check that the file name matches the id:
```
if ("#" + fname.split('.')[0] !== data["id"]) {
    // handle the error
}
```
    c. Verify that the object is a valid schema:
```
if (!YourValidator.validateSchema(data)) {
    // handle the error
}
```
    d. Remove the "$schema" field from the data, if present:
```
if (data["$schema"]) delete data["$schema"];
```
    e. Add the data to the "properties" field of the skeleton:
```
id = data["id"];
result["properties"][id] = data;
```
3. Register the schema with your validator:
```
YourValidator.addSchema("tcapi:1.0.0", result);
```
4. Now to register the formats. Load and validate formats/formats.json:
```
try {
    stringData = readFile("formats/formats.json");
    data = JSON.parse(stringData);
} catch (err) {
    // handle the error
}
```
5. For each item in the data, make the Regex and register it with your validator:
```
for (item in data.keys()) {
    rgx = new Regex(data[item]);
    YourValidator.addFormat(item, rgx);
}
```
6. Now you can validate stuff!
```
function validateAs(obj, id) {
    schema = { "$ref": "tcapi:1.0.0#" + id };
    YourValidator.validate(obj, schema);
}
```

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
* http://jmrware.com/articles/2009/uri_regexp/URI_regex.html
