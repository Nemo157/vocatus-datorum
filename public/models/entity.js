define([
    'lodash',
    'knockout',
    'knockout.mapping',
    'inflector'
], function (
    _,
    ko,
    mapping,
    inflector
) {
    var EntityType = function (config) {
        var Entity = function (data) {
            mapping.fromJS(data, Entity.mapping, this);
            this.url = ko.computed(_.bind(_.template('/${model.plural_name}/${id()}'), _, this));
        };

        Entity.singular_name = config.name;
        Entity.plural_name = inflector.pluralize(config.name);
        Entity.prototype.model = Entity;

        Entity.mapping = {
            create: function (options) {
                return new Entity(options.data);
            },
            key: function (data) {
                return ko.utils.unwrapObservable(data.id);
            }
        };

        return Entity;
    };

    return EntityType;
});
