var fs = require("fs"),
    glob = require("glob"),
    base = {
        "$schema": "http://json-schema.org/draft-04/schema#",
        type: "object",
        additionalProperties: false,
        properties: {}
    },
    version = "1.0.1",
    outputFile = version + ".json";

glob(
    version + "/**/*.json",
    function (err, files) {
        if (err) {
            throw new Error("Unable to glob schema files: " + err);
        }

        files.forEach(
            function (file) {
                if (file === version + "/formats/formats.json") {
                    return;
                }

                var schema = require(__dirname + "/../" + file);

                if (typeof schema["$schema"] !== "undefined") {
                    delete schema["$schema"];
                }

                base.properties[schema.id.slice(1)] = schema;
            }
        );

        fs.writeFile(
            __dirname + "/../" + outputFile,
            JSON.stringify(base, null, 2),
            function (err) {
                if (err) {
                    throw new Error("Failed to write combined file: " + err);
                }

                console.log("combined schema written to: " + outputFile);
            }
        );
    }
);

fs.writeFileSync(__dirname + "/../formats.json", fs.readFileSync(__dirname + "/../" + version + "/formats/formats.json"));
console.log("formats written to: formats.json");
