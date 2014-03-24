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
            this.loaded = ko.observable();
            if (data) {
                this.onLoad(false, data);
            }
            this.url = ko.computed(function () {
                return this.id() && _.template('${root}/${plural_name}/${id()}', this);
            }, this);
            if (config.init && config.init.call) {
                config.init.call(this);
            }
        };

        Entity.singular_name = config.name;
        Entity.plural_name = inflector.pluralize(config.name);

        Entity.prototype.singular_name = Entity.name;
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

        EntityBase.init(Entity, config);

        Entity.mapping = _.merge({
            create: function (options) {
                return Entity.create(options.data, true);
            },
            key: function (data) {
                return ko.utils.unwrapObservable(data.uri);
            }
        }, config.mapping);

        Entity.observableMapping = _.merge({
            create: function (options) {
                return ko.observable(Entity.create(options.data, false));
            },
            key: function (data) {
                return ko.utils.unwrapObservable(ko.utils.unwrapObservable(data).uri);
            }
        }, config.mapping);

        return Entity;
    };

    return EntityType;
});
