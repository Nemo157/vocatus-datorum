/* global console */
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
                if (this.uri()) {
                    return when($.get(this.uri())).then(_.bind(this.onLoad, this, true));
                } else {
                    return when(false);
                }
            };

            Entity.prototype.onLoad = function (loaded, data) {
                mapping.fromJS(data, Entity.mapping, this);
                if (config.afterRefresh) {
                    config.afterRefresh.call(this);
                    this.loaded(this.loaded() || loaded);
                    return this;
                } else {
                    this.loaded(this.loaded() || loaded);
                    return this;
                }
            };

            Entity.create = function (data, loaded) {
                var entity = EntityBase.find(config.name, data.uri);
                if (!entity) {
                    entity = new Entity(data);
                    var uri = data.uri;
                    EntityBase.cache(config.name, uri, entity);
                    entity.uri.subscribe(function () {
                        // We will leave the entity scattered throughout whatever cache locations it's been at.
                        console.log('WARNING: entity moved uri from ' + uri + ' to ' + entity.uri());
                        uri = entity.uri();
                        EntityBase.cache(config.name, uri, entity);
                    });
                }
                entity.loaded(entity.loaded() || loaded);
                return entity;
            };

            return Entity;
        }
    };

    return EntityBase;
});
