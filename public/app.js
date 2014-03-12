define([
    'jquery',
    'knockout',
    'sammy',
    'require',
    'bootstrap',
    'sammy.push_location_proxy'
], function (
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
        current_user: ko.observable()
    };

    sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        this.get('/:page', function () {
            var page = this.params.page;
            if (!app.pages[page]) {
                app.pages[page] = ko.observable();
            }
            app.current_page(page);
            require(['pages/' + page], function (pageModel) {
                app.pages[page](pageModel);
            });
        });
    }).run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
