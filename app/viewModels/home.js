define(["durandal/app", "durandal/system", "knockout", "data"], function (app, system, ko, data) {
    var profile = ko.utils.arrayFirst(data, function (item) {
            return item.id === "ngocdung"
        }),
        viewModel = {
            profile: ko.observable(profile)
        };

    return  viewModel;
});