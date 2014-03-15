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
    var EntityType = function (config) {
        var Entity = function (data) {
            this.id = ko.observable();
            this.onLoad(data);
            this.url = ko.computed(_.bind(_.template('/${model.plural_name}/${id()}'), _, this));
            if (config.init && config.init.call) {
                config.init.call(this);
            }
        };

        Entity.singular_name = config.name;
        Entity.plural_name = inflector.pluralize(config.name);

        Entity.prototype.model = Entity;
        Entity.prototype.list_url = '/' + Entity.plural_name;

        Entity.get = function (id) {
            return Entity.create({
                id: id,
                uri: '/api/' + Entity.plural_name + '/' + id
            });
        };

        EntityBase.init(Entity, config);

        return Entity;
    };

    return EntityType;
});
