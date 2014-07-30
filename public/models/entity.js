define([
    'lodash',
    'knockout',
    'knockout.refresh',
    'knockout.mapping',
    'inflector',
    './entity_base'
], function (
    _,
    ko,
    refresh,
    mapping,
    inflector,
    EntityBase
) {
    var EntityType = function (config) {
        var Entity = function (data, owner) {
            this.owner = ko.observable(owner);
            this.id = ko.observable();
            this.loaded = ko.observable();
            this.url = ko.computed(_.bind(_.template('${root}/${plural_name}/${id()}'), _, this));
            this.edit_url = ko.computed(_.bind(_.template('${url()}/edit'), _, this));
            this.onLoad(false, data);
            if (config.init && config.init.call) {
                config.init.call(this);
            }
        };

        Entity.singular_name = config.name;
        Entity.plural_name = inflector.pluralize(config.name);

        Entity.prototype.singular_name = Entity.singular_name;
        Entity.prototype.plural_name = Entity.plural_name;

        Entity.prototype.root = window.location.protocol + '//' + window.location.host;
        Entity.prototype.model = Entity;
        Entity.prototype.list_url = '/' + Entity.plural_name;

        Entity.get = function (id) {
            return Entity.create({
                id: id,
                uri: Entity.prototype.root + '/api/' + Entity.plural_name + '/' + id
            }, false);
        };

        Entity.nonObservableMapping = {
            create: function (options) {
                return Entity.create(options.data, true, options.parent);
            },
            key: function (data) {
                return ko.utils.unwrapObservable(data.uri);
            }
        };

        Entity.mapping = {
            create: function (options) {
                var entity = Entity.create(options.data, false, options.parent);
                return ko.observable(entity).extend({ refresh: entity });
            },
            key: function (data) {
                return ko.utils.unwrapObservable(ko.utils.unwrapObservable(data).uri);
            }
        };

        EntityBase.init(Entity, config);

        return Entity;
    };

    return EntityType;
});
