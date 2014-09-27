define(['knockout', 'text!components/slide-show/slide-show.html'], function (ko, templateMarkup) {
    function SlideShow(params) {
        this.items = ko.observable(params.items);
        this.options = params.options;
        this.id = "slide-show-" + Math.floor((Math.random() * 1000) + 1);

        setTimeout(function() {
            $(".carousel-inner").swipe( {
                //Generic swipe handler for all directions
                swipeLeft:function(event, direction, distance, duration, fingerCount) {
                    $(this).parent().carousel('prev');
                },
                swipeRight: function() {
                    $(this).parent().carousel('next');
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold:0
            });
        }, 500);
    }

    SlideShow.prototype.initCarousel = function (elem) {

    };

    // This runs when the component is torn down. Put here any logic necessary to clean up,
    // for example cancelling setTimeouts or disposing Knockout subscriptions/computeds.
    SlideShow.prototype.dispose = function () {

    };

    return { viewModel: SlideShow, template: templateMarkup };

});
