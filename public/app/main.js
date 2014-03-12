define([
    'jquery',
    'knockout',
    'bootstrap',
    'sammy',
    'sammy.push_location_proxy'
], function (
    $,
    ko,
    bootstrap,
    sammy,
    PushLocationProxy
) {
    sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        this.get('/:page', function () {
            $('#main').text(this.params.page[0].toUpperCase() + this.params.page.slice(1) + '!');
        });
    }).run();

    var app = {
        current_user: ko.observable()
    };

    ko.applyBindings(app);
});
