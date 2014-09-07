define([
    'lodash',
    'sammy',
    'sammy.push_location_proxy',
    'json!routes'
], function (
    _,
    Sammy,
    PushLocationProxy,
    routes
) {
    var route_helpers = {
        '/user': {
            params: function (app) {
                return { user_id: app.user() && app.user().id() };
            }
        },
        '/session': {
            params: function (app) {
                return { user_session_id: app.session() && app.session().id() };
            }
        }
    };

    var Router = function (app, pager) {
        this.setLocationProxy(new PushLocationProxy(this));

        this.app = app;
        this.pager = pager;

        this.map = {};
        this.mapRoutes('', routes);

        this.get('/:page', function () {
            this.app.pager.goToPage(this.params.page, this.app.getParams(this.path, this.params), this.path);
        });
    };

    Router.prototype = new Sammy.Application();
    Router.prototype.constructor = Router;

    Router.prototype.redirect = function (newLocation) {
        var oldLocation = this.getLocation();
        this.setLocation(newLocation);
        if (oldLocation !== this.getLocation()) {
            this.trigger('location-changed');
        }
    };

    Router.prototype.mapRoutes = function (root, routes) {
        _.forEach(routes, function (map, route) {
            var fullRoute = (root + (route && ('/' + route))) || '/';
            if (_.isString(map)) {
                this.get(fullRoute, function () {
                    this.app.pager.goToPage(map, this.app.getParams(this.path, this.params), this.path);
                });
                _.last(this.routes.get).fullRoute = fullRoute;
                this.map[fullRoute] = map;
            } else {
                this.mapRoutes(root + '/' + route, map);
            }
        }, this);
    };

    Router.prototype.getPage = function (route, params) {
        return route.fullRoute ? this.map[route.fullRoute] : params.page;
    };

    Router.prototype.getParams = function (path, params) {
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


    return Router;
});
