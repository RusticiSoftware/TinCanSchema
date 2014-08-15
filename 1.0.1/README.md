Schema for Tin Can API v1.0.1 (`tcapi:1.0.1`)
=============================================
A JSON schema for the
[xAPI 1.0.1](https://github.com/adlnet/xAPI-Spec/blob/master/xAPI.md) (Tin Can
API) standard. It is being tested using
https://github.com/RusticiSoftware/TinCanValidator.


Files
-----
Many of the files here are not complete objects, but are used as overlaid rules
on other objects. Such overlay objects are generally not useful to test against.

The *non-*overlay objects most useful for testing are

* `about`\*
* `account!core`
* `activity`
* `activity_definition`
* `activityid!core`\*\*
* `activity_list_or_obj`
* `agent`
* `anonymousgroup`
* `attachment`
* `context`
* `contextactivities`
* `extensions`\*
* `group`
* `identifiedgroup`
* `interactioncomponent`
* `interactioncomponent_list`
* `languagemap`\*
* `mbox!core`\*\*
* `mbox_sha1sum!core`\*\*
* `openid!core`\*\*
* `person`\* (AKA Agent Profile)
* `result`
* `score`
* `statement`\*
* `statement_object`
* `statementref`
* `statementresult`
* `substatement`
* `verb`

\* Probably important
<br/>
\*\* Formatted string, not an object

The overlay objects are listed here. If they contain non-overlay objects, these
are listed in parenthesis.

* `account` (`account!core`)
* `activity_definition`
* `activityid` (`activityid!core`)
* `group_base`
* `interactionactivity`
* `interactionactivity_base`
* `interactionactivity_choices`
* `interactionactivity_none`
* `interactionactivity_scale`
* `interactionactivity_sourcetarget`
* `interactionactivity_steps`
* `inversefunctional`
* `mbox` (`mbox!core`)
* `mbox_sha1sum` (`mbox_sha1sum!core`)
* `openid` (`openid!core`)
* `statement_base`

Naming conventions
------------------

### File names
The following rules were applied to name the files. Exactly one of these was
used, preferring rules higher in the list. All uppercase letters are converted
to lowercase in the file name.

1. If it is the sole object with an "objectType" property of value `type`:

        type ".json"

2. If it is one of many objects with an "objectType" property of value `type`,
   and is named in the xAPI spec as `subtype` `type`:

        subtype type ".json"

3. If the xAPI spec devotes a numbered section to an object `object`:

        object ".json"

4. If it is an array containing `itemtype` objects:

        itemtype "_list.json"

5. If it may be either an array of `itemtype` objects or a single `itemtype`:

        itemtype "_list_or_obj.json"

6. If it is a base object that is extended by other objects defined by the xAPI
   spec, belonging to `category`:

        category "_base.json"

7. If the xAPI spec defines an object `child` as a child of only one other
   object `parent`:

        parent "_" child ".json"

8. If it is an object containing only one property `prop`:

        prop ".json"


### JSON Schema ids
The top level object in a file named `name ".json"` is given a schema id of

    "#" name

If the top level object in `name ".json"` contains only one property, this one
property is often useful on its own. In such cases, the property is given a
JSON Schema id of its own, for outside reference by other schema files:

    "#" name "!core"


TODO
----
* Verification of SCORM data model elements (SCORM 2004:4.1.1) in interaction
  activities' `correctResponsePattern`s, eg. `1[.]a[,]2[.]c[,]3[.]b`,
  `{lang=de}Hallo, Welt!`
