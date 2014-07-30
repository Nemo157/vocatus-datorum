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
        this.ready = ko.computed(function () {
            return !!this.entities();
        }, this);
    };

    EntitiesPage.prototype.refresh = function (params, forceRefresh) {
        if (this.entities()) {
            if (forceRefresh) {
                return this.entities().refresh();
            } else {
                return when(true);
            }
        } else {
            return this.model.get().refresh().then(this.entities);
        }
    };

    return EntitiesPage;
});
