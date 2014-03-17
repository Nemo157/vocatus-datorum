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
        '': 'index',
        'cocktails': {
            '': 'cocktails/index',
            ':id': 'cocktails/show'
        },
        'ingredients': {
            '': 'ingredients/index',
            ':id': 'ingredients/show'
        },
        'spirits': {
            '': 'spirits/index',
            ':id': 'spirits/show'
        },
        'mixers': {
            '': 'mixers/index',
            ':id': 'mixers/show'
        }
    };

    var router = sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        var mapRoutes = _.bind(function (root, routes) {
            _.forEach(routes, function (map, route) {
                if (_.isString(map)) {
                    this.get(root + (route ? '/' + route : ''), function () {
                        this.app.app.goToPage(map, this.params);
                    });
                } else {
                    mapRoutes(root + route, map);
                }
            }, this);
        }, this);

        mapRoutes('/', explicitRoutes);

        this.get('/:page', function () {
            this.app.app.goToPage(this.params.page, this.params);
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
