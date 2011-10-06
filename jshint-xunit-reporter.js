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

        out.push("<?xml version=\"1.0\" ?>");
        out.push("<testsuite name=\"JSHint\" time=\"0.000\">");
        out.push("\t<testcase name=\"Generic JSHint Test\"  time=\"0.000\"/>");
        for (file in files) {
            for (i = 0; i < files[file].length; i++) {
                issue = files[file][i];
                out.push("\t<testcase name=\"jshint." + file + ".Issue#" + i +"\" time=\"0.000\">");
                out.push("\t\t<failure message=\"line " + issue.line +", col " + issue.character + ", " + encode(issue.reason) + "\" type=\"JSHint Error\">");
                out.push("\t\t</failure>");
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