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

            Entity.fullMapping = _.merge(Entity.mapping, config.mapping);

            Entity.prototype.refresh = function () {
                if (this.uri()) {
                    return when($.get(this.uri())).then(_.bind(this.onLoad, this, true));
                } else {
                    return when(false);
                }
            };

            Entity.ensureMappingInitialized = function () {
                if (!Entity.mappingInitialized) {
                    Entity.mappingInitialized = true;
                    _.forEach(Entity.fullMapping, function (value, key) {
                        if (_.isString(value)) {
                            Entity.fullMapping[key] = require(value).mapping;
                        } else if (_.isPlainObject(value) && _.has(value, 'model') && _.has(value, 'mapping')) {
                            Entity.fullMapping[key] = require(value.model)[value.mapping];
                        }
                    });
                }
            };

            Entity.prototype.onLoad = function (loaded, data) {
                Entity.ensureMappingInitialized();
                mapping.fromJS(data || {}, Entity.fullMapping, this);
                if (loaded) {
                    this.loaded(true);
                }
                return this;
            };

            Entity.create = function (data, loaded, owner) {
                var entity = EntityBase.find(config.name, data.uri);
                if (entity) {
                    entity.owner(owner);
                } else {
                    entity = new Entity(data, owner);
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
