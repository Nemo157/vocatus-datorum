define([
    'lodash',
    'jquery'
], function (
    _,
    $
) {
    var _decode = function (str) {
        return decodeURIComponent((str || '').replace(/\+/g, ' '));
    };

    var Preloader = function (router, app) {
        _.bindAll(this);
        this.app = app;
        this.router = router;
        router.$element().on('mouseenter', 'a', this.onMouseEnter);
        router.$element().on('mouseleave', 'a', this.onMouseLeave);
    };

    Preloader.prototype.onMouseEnter = function (event) {
        if (location.hostname === event.target.hostname) {
            if (this.timer) {
                window.clearTimeout(this.timer);
            }
            this.path = $(event.target).attr('href');
            this.timer = window.setTimeout(this.preloadPage, 100);
        }
    };

    Preloader.prototype.onMouseLeave = function (event) {
        if (location.hostname === event.target.hostname) {
            if (this.timer && this.path === $(event.target).attr('href')) {
                window.clearTimeout(this.timer);
                this.timer = null;
                this.path = null;
            }
        }
    };

    Preloader.prototype.preloadPage = function () {
        var route = this.router.lookupRoute('get', this.path);
        var params = {};

        if (route) {
            var path_params = route.path.exec(this.router.routablePath(this.path));
            if (path_params !== null) {
                path_params.shift();
                $.each(path_params, function(i, param) {
                    if (route.param_names[i]) {
                        params[route.param_names[i]] = _decode(param);
                    } else {
                        if (!params.splat) {
                            params.splat = [];
                        }
                        params.splat.push(_decode(param));
                    }
                });
            }

            var page = this.router.getPage(route, params);
            var page_params = this.router.getParams(this.path, params);
            var id = page.replace(/\//g, '-');
            this.app.ensurePageLoaded(id, page, page_params);
        }
    };

    return Preloader;
});

