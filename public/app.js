/* global console */
define([
    'lodash',
    'jquery',
    'knockout',
    'sammy',
    'require',
    'bootstrap',
    'sammy.push_location_proxy'
], function (
    _,
    $,
    ko,
    sammy,
    require,
    bootstrap,
    PushLocationProxy
) {
    var app = {
        pages: {},
        current_page: ko.observable(),
        current_user: ko.observable(),
        goToPage: function (page) {
            if (!this.pages[page]) {
                this.pages[page] = ko.observable();
                require(
                    ['pages/' + page],
                    _.bind(this.pageLoaded, this, page),
                    _.bind(this.pageLoadFailed, this, page));
            }
            this.current_page(page);
        },
        pageLoaded: function (page, pageModel) {
            this.pages[page](pageModel);
        },
        pageLoadFailed: function (page, error) {
            console.log("Failed to load page " + page);
            console.log(error);
        }
    };

    sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        this.get('/', function () {
            app.goToPage('root');
        });

        this.get('/:page', function () {
            app.goToPage(this.params.page);
        });
    }).run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
