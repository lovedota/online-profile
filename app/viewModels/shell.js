define(["plugins/router"], function (router) {
    return {
        router: router,
        activate: function () {
            return router.map([
                { route: ["", "home"],     moduleId: "viewModels/home",             title: "About me",        nav: 1 },
                { route: "history",        moduleId: "viewModels/history",          title: "Career History",  nav: 2 },
                { route: "technology",     moduleId: "viewModels/technology",       title: "Page Technology", nav: 3 }
            ]).buildNavigationModel()
                .mapUnknownRoutes("viewModels/not-found", "not-found")
                .activate({pushState: false});
        }
    };
});