define([
    'jquery',
    'lodash',
    'knockout',
    'knockout.mapping',
    'when'
], function (
    $,
    _,
    ko,
    mapping,
    when
) {
    var EntityBase = {
        caches: {},

        getCache: function (typeName) {
            return EntityBase.caches[typeName] || (EntityBase.caches[typeName] = {});
        },

        find: function (typeName, uri) {
            return EntityBase.getCache(typeName)[uri];
        },

        cache: function (typeName, uri, entity) {
            EntityBase.getCache(typeName)[uri] = entity;
        },

        init: function (Entity, config) {
            Entity.prototype.list_url = '/' + Entity.plural_name;

            Entity.prototype.refresh = function () {
                return when($.get(this.uri())).then(_.bind(this.onLoad, this));
            };

            Entity.prototype.onLoad = function (data) {
                mapping.fromJS(data, Entity.mapping, this);
                if (config.afterRefresh) {
                    var self = this;
                    return when(config.afterRefresh.call(this)).then(function () { return self; });
                } else {
                    return this;
                }
            };

            Entity.mapping = _.merge({
                create: function (options) {
                    return Entity.create(options.data);
                },
                key: function (data) {
                    return ko.utils.unwrapObservable(data.uri);
                }
            }, config.mapping);

            Entity.create = function (data) {
                var entity = EntityBase.find(config.name, data.uri);
                if (!entity) {
                    entity = new Entity(data);
                    var uri = data.uri;
                    EntityBase.cache(config.name, uri, entity);
                    entity.uri.subscribe(function () {
                        // We will leave the entity scattered throughout whatever cache locations it's been at.
                        uri = entity.uri();
                        EntityBase.cache(config.name, uri, entity);
                    });
                }
                return entity;
            };

            return Entity;
        }
    };

    return EntityBase;
});
