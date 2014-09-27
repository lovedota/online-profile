define(["durandal/app", "durandal/system", "knockout", "data"], function (app, system, ko, data) {
    var profile = ko.utils.arrayFirst(data, function (item) {
            return item.id === "ngocdung"
        }),
        scrollTimeout,
        $timelineWrapper,
        $periodPanel,
        $pagehost,
        $navbar,
        viewModel = {
            profile: ko.observable(profile),
            activePeriodId: ko.observable(0),
            activeDetailId: ko.observable(0),
            changePeriod: function (data, event) {
                var $elementToScroll =  $("#timeline-id-" + data.id);

                viewModel.activePeriodId(data.id);
                viewModel.activeDetailId(data.id);

                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                //Give a flag to prevent the scroll event happen while manual scroll is executed.
                $pagehost.data("auto-scroll", true);
                $pagehost.scrollTo($elementToScroll, {offsetTop: 220}, function () {
                    //set timeout because the scroll need time to finish.
                    scrollTimeout = setTimeout(function () {
                        $timelineWrapper.data("auto-scroll", false);
                    }, 1000);
                });
            },
            attached: function () {
                if (!$timelineWrapper) {
                    $navbar = $(".navbar.navbar-default");
                    $timelineWrapper = $("#timeline-wrapper");
                    $pagehost = $("#history-page-host");
                    $periodPanel = $("#period-panel");
                }

                $pagehost.css("top", $navbar.height() + $periodPanel.outerHeight());

                $(window).resize(function() {
                    $pagehost.css("top", $navbar.outerHeight() + $periodPanel.outerHeight());
                });

                $timelineWrapper.scroll(function (e) {
                    if ($timelineWrapper.data("auto-scroll")) {
                        return;
                    }
                    var lastVisibleId = 0,
                        scrollTop = $timelineWrapper.scrollTop(),
                        visibleIds = [];

                    if (scrollTop !== 0) {
                        $('ul li.timeline-content', $pagehost).each(function(value, index){
                            // Is this element visible onscreen?
                            var visible = $(this).visible("partial"),
                                context = ko.contextFor(this);
                            if (visible) {
                                lastVisibleId = context.$parent.id;
                                visibleIds.push(lastVisibleId);
                            }
                        });
                    }

                    visibleIds = ko.utils.arrayGetDistinctValues(visibleIds);
                    if (visibleIds.length > 0) {
                        viewModel.activePeriodId(lastVisibleId);
                    }
                });
            }
        };

    return  viewModel;
});