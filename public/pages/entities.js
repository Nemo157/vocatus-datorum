
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
    var titleCase = function (str) {
        // http://stackoverflow.com/a/196991/260593
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };

    var EntitiesPage = function (config) {
        _.bindAll(this);
        this.entities = ko.observableArray();
        this[config.model.plural_name] = this.entities;
        this.model = config.model;
        this.url = config.url;
        this.title = titleCase(config.model.plural_name);
    };

    EntitiesPage.prototype.refresh = function () {
        $.get(this.url, this.onData);
    };

    EntitiesPage.prototype.onData = function (data) {
        mapping.fromJS(data.items, this.model.mapping, this.entities);
    };

    return EntitiesPage;
});
