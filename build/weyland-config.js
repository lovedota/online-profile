exports.config = function(weyland) {
    weyland.build('main')
        .task.jshint({
            include:'app/**/*.js'
        })
        .task.uglifyjs({
            include:['app/**/*.js', 'js/durandal/**/*.js']
        })
        .task.rjs({
            include:['app/**/*.{js,html}', 'js/durandal/**/*.js'],
            loaderPluginExtensionMaps:{
                '.html':'text'
            },
            rjs:{
                name:'../js/almond-custom', //to deploy with require.js, use the build's name here instead
                insertRequire:['main'], //not needed for require
                baseUrl : 'app',
                wrap:true, //not needed for require
                paths : {
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
                inlineText: true,
                optimize : 'none',
                pragmas: {
                    build: true
                },
                stubModules : ['text'],
                keepBuildDir: true,
                out:'app/main-built.js'
            }
        });
}