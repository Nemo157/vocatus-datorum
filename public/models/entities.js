define([
    'lodash',
    'knockout',
    'inflector',
    './entity_base'
], function (
    _,
    ko,
    inflector,
    EntityBase
) {
    var EntityListType = function (config) {
        var EntityList = function (data) {
            this.items = ko.observableArray();
            this.onLoad(false, data);
            if (config.init && config.init.call) {
                config.init.call(this);
            }
        };

        EntityList.plural_name = config.name;
        EntityList.singular_name = inflector.singularize(config.name);

        EntityList.prototype.root = window.location.protocol + '//' + window.location.host;
        EntityList.prototype.model = config.model;
        EntityList.prototype.list_model = EntityList;
        EntityList.prototype.list_url = '/' + EntityList.plural_name;

        EntityList.get = function (uri) {
            return EntityList.create({
                uri: uri || EntityList.prototype.root + '/api/' + EntityList.plural_name
            });
        };

        EntityBase.init(EntityList, config);

        EntityList.mapping.items = config.model.mapping;

        return EntityList;
    };

    return EntityListType;
});
