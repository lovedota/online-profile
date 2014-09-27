(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['knockout'], factory);
    } else {
        // Browser globals
        factory(ko);
    }
}(function(ko) {
    ko.bindingHandlers.scrollTo = {
        init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            // This will be called when the binding is first applied to an element
            // Set up any initial state, event handlers, etc. here
        },
        update: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
            var target = $(element),
                options = allBindings().scrollToOptions,
                condition = valueAccessor(),
                $scrollDiv;

            if (condition) {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                $scrollDiv = $(options.scrollDiv ? options.scrollDiv : "html, body");
                $scrollDiv.data("auto-scroll", true);
                $scrollDiv.scrollTo(target, {offsetTop: 70}, function () {

                });
            }
        }
    };
}));

