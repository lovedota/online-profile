// require.js looks for the following global when initializing
var require = {
    urlArgs: "1.1",
    paths: {
        "jquery":               "../js/jquery/jquery",
        "jquery-plugins":       "../js/jquery/jquery-plugins",
        "jquery-touchswipe":    "../js/jquery/jquery-touchswipe",
        "bootstrap":            "../js/bootstrap/bootstrap.min",
        "text":                 "../js/text",
        "knockout":             "../js/knockout/knockout",
        "knockout-punches":     "../js/knockout/knockout.punches",
        "knockout-projections": "../js/knockout/knockout-projections",
        "knockout-bindings":    "../js/knockout/knockout.bindings",
        "durandal":             "../js/durandal",
        "plugins":              "../js/durandal/plugins",
        "transitions":          "../js/durandal/transitions",
        "moment":               "../js/moment",
        "data":                 "../app/data"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] },
        "jquery-plugins": { deps: ["jquery"] },
        "jquery-touchswipe": { deps: ["jquery"] },
        "knockout-punches": {deps: ["knockout"]},
        "knockout-bindings": {deps: ["knockout"]},
        "knockout-projections": {deps: ["knockout"]}
    }
};
