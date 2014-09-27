requirejs.config({
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
});



define(["durandal/system", "durandal/app", "durandal/viewLocator", "jquery", "knockout", "knockout-punches", "knockout-projections", "knockout-bindings", "bootstrap", "moment", "jquery-plugins", "jquery-touchswipe"],  function (system, app, viewLocator, $, ko) {
    //>>excludeStart("build", true);
    system.debug(false);
    //>>excludeEnd("build");
    ko.punches.enableAll();
    ko.punches.interpolationMarkup.enable();
    ko.punches.attributeInterpolationMarkup.enable();

    //Custom filter can be used like "| append: 'xyz'"
    ko.filters.date = function(value, arg1) {
        return value ? moment(value).format(arg1): "";
    };

    ko.components.register('slide-show', { require: 'components/slide-show/slide-show' });

    app.title = "My Online Profile";

    app.configurePlugins({
        router: true,
        dialog: true,
        widget: {
            kinds: ["expander"]
        }
    });

    app.start().then(function () {
        viewLocator.useConvention();
        app.setRoot("viewModels/shell");
    });
});