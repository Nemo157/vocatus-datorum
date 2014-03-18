define([
    'lodash',
    'sammy',
    'sammy.push_location_proxy'
], function (
    _,
    sammy,
    PushLocationProxy
) {
    var explicitRoutes = {
        '/': 'index',
        'cocktails': {
            '': 'cocktails/index',
            'new': 'cocktails/new',
            ':cocktail_id': 'cocktails/show',
            'recipes': {
                '': 'recipes/index',
                'new': 'recipes/new',
                ':recipe_id': 'recipes/show'
            }
        },
        'ingredients': {
            '': 'ingredients/index',
            'new': 'ingredients/new',
            ':ingredient_id': 'ingredients/show'
        },
        'spirits': {
            '': 'spirits/index',
            'new': 'spirits/new',
            ':spirit_id': 'spirits/show'
        },
        'mixers': {
            '': 'mixers/index',
            'new': 'mixers/new',
            ':mixer_id': 'mixers/show'
        },
        'users': {
            '': 'users/index',
            'new': 'users/new',
            ':user_id': 'users/show'
        },
        'sessions': {
            '': 'user_sessions/index',
            'new': 'user_sessions/new',
            ':user_session_id': 'user_sessions/show'
        },
        'register': 'users/new',
        'login': 'user_sessions/new',
        'user': {
            route: 'users/show',
            params: function (app) {
                return { user_id: app.user().id() };
            }
        },
        'session': {
            route: 'user_sessions/show',
            params: function (app) {
                return { user_session_id: app.session().id() };
            }
        }
    };

    var router = sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        var mapRoutes = _.bind(function (root, routes) {
            _.forEach(routes, function (map, route) {
                if (_.isString(map)) {
                    this.get(root + (route && route !== '/' ? '/' + route : route), function () {
                        this.app.app.goToPage(map, this.params, this.path);
                    });
                } else if (_.isPlainObject(map) && _.has(map, 'route') && _.has(map, 'params')) {
                    this.get(root + (route && route !== '/' ? '/' + route : route), function () {
                        var params = _.isPlainObject(map.params) ? map.params : _.isFunction(map.params) ? map.params(this.app.app) : this.params;
                        this.app.app.goToPage(map.route, params, this.path);
                    });
                } else {
                    mapRoutes(root + '/' + route, map);
                }
            }, this);
        }, this);

        mapRoutes('', explicitRoutes);

        this.get('/:page', function () {
            this.app.app.goToPage(this.params.page, this.params, this.path);
        });

        this.setApp = function (app) {
            this.app = app;
        };

        this.redirect = function (new_location) {
            var old_location = this.getLocation();
            this.setLocation(new_location);
            if (old_location !== this.getLocation()) {
                this.trigger('location-changed');
            }
        };
    });

    return router;
});
