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
    var EntityListType = function (config) {
        var EntityList = function (data, owner) {
            this.owner = ko.observable(owner);
            this.items = ko.observableArray();
            this.loaded = ko.observable();
            this.url = ko.computed(function () {
                return this.owner() && _.template('${owner().url()}/${plural_name}', this);
            }, this);
            this.onLoad(false, data);
            if (config.init && config.init.call) {
                config.init.call(this);
            }
        };

        if (!_.has(config, 'model')) {
            config.model = 'models/' + inflector.singularize(config.name);
        }

        EntityList.plural_name = config.name;
        EntityList.singular_name = inflector.singularize(config.name);

        EntityList.prototype.singular_name = EntityList.singular_name;
        EntityList.prototype.plural_name = EntityList.plural_name;

        EntityList.prototype.root = window.location.protocol + '//' + window.location.host;
        EntityList.prototype.model = config.model;
        EntityList.prototype.list_model = EntityList;
        EntityList.prototype.list_url = '/' + EntityList.plural_name;
        EntityList.prototype.new_url = '/' + EntityList.plural_name + '/new';

        EntityList.get = function (uri) {
            return EntityList.create({
                uri: uri || EntityList.prototype.root + '/api/' + EntityList.plural_name
            });
        };

        var afterRefresh = config.afterRefresh;
        config.afterRefresh = function () {
            _.invoke(this.items(), 'refresh');
            if (afterRefresh) {
                afterRefresh.apply(this);
            }
        };

        EntityList.mapping = {
            create: function (options) {
                var entity = EntityList.create(options.data, false, options.parent);
                return ko.observable(entity).extend({ refresh: entity });
            },
            key: function (data) {
                return ko.utils.unwrapObservable(ko.utils.unwrapObservable(data).uri);
            }
        };

        if (!config.mapping) {
            config.mapping = {};
        }

        config.mapping.items = _.isString(config.model) ? {
            model: config.model,
            mapping: 'nonObservableMapping'
        } : config.model.nonObservableMapping;

        EntityBase.init(EntityList, config);

        return EntityList;
    };

    return EntityListType;
});
