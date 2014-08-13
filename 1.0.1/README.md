Tin Can Schema
==========================

An in-progress JSON schema for the [xAPI 1.0.1](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md) (TinCan) standard. It is being tested using https://github.com/chaimleib-scorm/TinCanValidator.

Structure
---------
Many of the files here are not complete objects, but are used as overlaid rules on other objects. The non-overlay objects are

* **about**
* account!core
* activity
* activity_definition
* activityid!core
* activity_list_or_obj
* agent
* anonymousgroup
* attachment
* context
* contextactivities
* **extensions**
* group
* identifiedgroup
* interactioncomponent
* interactioncomponent_list
* **languagemap**
* mbox!core
* mbox_sha1sum!core
* openid!core
* **person** (AKA Agent Profile)
* result
* score
* **statement**
* statement_object
* statement_ref
* statementresult
* substatement
* verb

The overlay objects are listed here. If they contain non-overlay objects, these are listed in parenthesis.

* account (account!core)
* activity_definition
* activityid (activityid!core)
* group_base
* interactionactivity
* interactionactivity_base
* interactionactivity_choices
* interactionactivity_none
* interactionactivity_scale
* interactionactivity_sourcetarget
* interactionactivity_steps
* inversefunctional
* mbox (mbox!core)
* mbox_sha1sum (mbox_sha1sum!core)
* openid (openid!core)
* statement_base

Naming conventions
------------------

### File names

The following rules were applied to name the files. Exactly one of these was used, preferring rules higher in the list. All uppercase letters are converted to lowercase in the file name.

1. If it is the sole object with an "objectType" property of value `type`:

        type ".json"

2. If it is one of many objects with an "objectType" property of value `type`, and is named in the xAPI spec as `subtype` `type`:

        subtype type ".json"

3. If the xAPI spec devotes a numbered section to an object `object`:

        object ".json"

4. If it is an array containing `itemtype` objects:

        itemtype "_list.json"

5. If it may be either an array of `itemtype` objects or a single `itemtype`:

        itemtype "_list_or_obj.json"

6. If it is a base object that is extended by other objects defined by the xAPI spec, belonging to `category`:

        category "_base.json"

7. If the xAPI spec defines an object `child` as a child of only one other object `parent`:

        parent "_" child ".json"

8. If it is an object containing only one property `prop`:

        prop ".json"


### JSON Schema ids

The top level object in a file named `name ".json"` is given a schema id of

    "#" name

If the top level object in `name ".json"` contains only one property, this one property is often useful on its own. In such cases, the property is given a JSON Schema id of its own, for outside reference by other schema files:

    "#" name "!core"


Build the schema
----------------
You can use https://github.com/chaimleib-scorm/TinCanValidator to do this for you.

If you don't want to use that, follow these instructions:

The JSON files on the root level of this directory were designed to be joined together in a single schema object. To create this object:

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
        id = data["id"];
        result["properties"][id] = data;
    }

    // 3. Register the schema with your validator:
    YourValidator.addSchema("tcapi:1.0.1", result);

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
        schema = { "$ref": "tcapi:1.0.1#" + id };
        YourValidator.validate(obj, schema);
    }

TODO
----
* Verification of SCORM data model elements (SCORM 2004:4.1.1) in interaction activities' `correctResponsePattern`s, eg. `1[.]a[,]2[.]c[,]3[.]b`, `{lang=de}Hallo, Welt!`
