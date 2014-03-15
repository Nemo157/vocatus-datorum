define([
    'lodash',
    'jquery',
    'knockout'
], function (
    _,
    $,
    ko
) {
    var titleCase = function (str) {
        // http://stackoverflow.com/a/196991/260593
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    var EntitiesPage = function (config) {
        _.bindAll(this);
        this.entities = ko.observable();
        this[config.model.plural_name] = this.entities;
        this.model = config.model;
        this.title = titleCase(config.model.plural_name);
    };

    EntitiesPage.prototype.refresh = function () {
        this.model.get().refresh().done(this.entities);
    };

    return EntitiesPage;
});
