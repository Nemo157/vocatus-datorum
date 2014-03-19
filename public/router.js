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

        var mapRoutes = _.bind(function (root, routes) {
            _.forEach(routes, function (map, route) {
                var fullRoute = (root + (route && ('/' + route))) || '/';
                if (_.isString(map)) {
                    if (_.has(route_helpers, fullRoute)) {
                        this.get(fullRoute, function () {
                            var params = _.isPlainObject(route_helpers[fullRoute].params) ? route_helpers[fullRoute].params : _.isFunction(route_helpers[fullRoute].params) ? route_helpers[fullRoute].params(this.app.app) : this.params;
                            this.app.app.goToPage(map, params, this.path);
                        });
                    } else {
                        this.get(fullRoute, function () {
                            this.app.app.goToPage(map, this.params, this.path);
                        });
                    }
                } else {
                    mapRoutes(root + '/' + route, map);
                }
            }, this);
        }, this);

        mapRoutes('', routes);

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
