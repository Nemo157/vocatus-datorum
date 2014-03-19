define([
    'lodash',
    'sammy',
    'sammy.push_location_proxy',
    'json!routes'
], function (
    _,
    sammy,
    PushLocationProxy,
    routes
) {

    var route_helpers = {
        '/user': {
            params: function (app) {
                return { user_id: app.user().id() };
            }
        },
        '/session': {
            params: function (app) {
                return { user_session_id: app.session().id() };
            }
        }
    };

    var router = sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        this.map = {};
        var mapRoutes = _.bind(function (root, routes) {
            _.forEach(routes, function (map, route) {
                var fullRoute = (root + (route && ('/' + route))) || '/';
                if (_.isString(map)) {
                    this.get(fullRoute, function () {
                        this.app.pager.goToPage(map, this.app.getParams(this.path, this.params), this.path);
                    });
                    _.last(this.routes.get).fullRoute = fullRoute;
                    this.map[fullRoute] = map;
                } else {
                    mapRoutes(root + '/' + route, map);
                }
            }, this);
        }, this);

        this.getPage = function (route, params) {
            return route.fullRoute ? this.map[route.fullRoute] : params.page;
        };

        this.getParams = function (path, params) {
            if (route_helpers[path]) {
                if (_.isPlainObject(route_helpers[path].params)) {
                    return route_helpers[path].params;
                } else if (_.isFunction(route_helpers[path].params)) {
                    return route_helpers[path].params(this.app);
                } else {
                    return params;
                }
            } else {
                return params;
            }
        };

        mapRoutes('', routes);

        this.get('/:page', function () {
            this.app.pager.goToPage(this.params.page, this.app.getParams(this.path, this.params), this.path);
        });

        this.setApp = function (app) {
            this.app = app;
        };

        this.setPager = function (pager) {
            this.pager = pager;
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
