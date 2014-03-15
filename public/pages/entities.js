
define([
    'lodash',
    'jquery',
    'knockout',
    'knockout.mapping'
], function (
    _,
    $,
    ko,
    mapping
) {
    var EntitiesPage = function (config) {
        _.bindAll(this);
        this.entities = ko.observableArray();
        this[config.model.plural_name] = this.entities;
        this.model = config.model;
        this.url = config.url;
    };

    EntitiesPage.prototype.refresh = function () {
        $.get(this.url, this.onData);
    };

    EntitiesPage.prototype.onData = function (data) {
        mapping.fromJS(data.items, this.model.mapping, this.entities);
    };

    return EntitiesPage;
});
