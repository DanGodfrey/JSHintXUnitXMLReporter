module.exports =
{
    reporter: function (results)
    {
        "use strict";

        var files = {},
        out = [],
        pairs = {
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
            "<": "&lt;",
            ">": "&gt;"
        },
        file, i, issue;

        function encode(s) {
            for (var r in pairs) {
                if (typeof(s) !== "undefined") {
                    s = s.replace(new RegExp(r, "g"), pairs[r]);
                }
            }
            return s || "";
        }


        results.forEach(function (result) {
            result.file = result.file.replace(/^\.\//, '');
            if (!files[result.file]) {
                files[result.file] = [];
            }
            files[result.file].push(result.error);
        });

        out.push("<?xml version=\"1.0\" encoding=\"utf-8\"?>");
        out.push("<testsuite name=\"JSHint\">");

        for (file in files) {
            for (i = 0; i < files[file].length; i++) {
                issue = files[file][i];
                out.push("\t<testcase classname=\"jshint." + file + ".Issue#" + i +"\">");
                out.push("\t\t<error message=\"line " + issue.line +", col " + issue.character + ", " + encode(issue.reason) + "\" type=\"JSHint Error\">");
                out.push("\t\t</error>");
                out.push("\t</testcase>");
            }
        }

        out.push("</testsuite>");

        process.stdout.on('end', function () {
            process.exit(results.length > 0 ? 1 : 0);
        });

        process.stdout.write(out.join("\n") + "\n");
    }
};