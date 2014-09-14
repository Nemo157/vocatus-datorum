define([
    'lodash',
    'jquery',
    'knockout',
    'when'
], function (
    _,
    $,
    ko,
    when
) {
    var Woodhouse = function (user) {
        this.user = user;
        this.available = ko.observable(false);
        this.current_recipe = ko.observable();
        when($.ajax({
            type: 'GET',
            url: 'http://woodhouse/',
            contentType: 'application/json',
            processData: false
        })).done(_.bind(function () {
            this.available(true);
        }, this), _.bind(function () {
            this.available(false);
        }, this));
    };

    Woodhouse.prototype.pour = function (recipe) {
        this.current_recipe(recipe);
        $('#woodhouse').modal('show');
    };

    return Woodhouse;
});
