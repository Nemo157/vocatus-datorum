/* global requirejs */
(function () {
    var choose = function (production, development) {
        return development;
    };

    var prodSuffix = function (base, suffix) {
        return choose(base + suffix, base);
    };

    var devSuffix = function (base, suffix) {
        return choose(base, base + suffix);
    };

    var vendored = function (name, dist) {
        return prodSuffix('/vendor/' + name + '/' + (dist || 'dist') + '/' + name, '.min');
    };

    var vendor2ed = function (name) {
        return prodSuffix('/vendor/' + name, '.min');
    };

    requirejs.config({
        baseUrl: '/',
        paths: {
            'jquery': vendored('jquery'),
            'bootstrap': prodSuffix('/vendor/bootstrap/dist/js/bootstrap', '.min'),
            'lodash': vendored('lodash'),
            'postal': vendored('postal', 'lib'),
            'knockout': devSuffix('/vendor/knockout/build/output/knockout-latest', '.debug'),
            'knockout-projections': vendored('one-com-knockout-projections'),
            'knockout.mapping': '/vendor/knockout.mapping/knockout.mapping',
            'jStorage': '/vendor2/jstorage.min',
            'sammy': '/vendor/shimney-sammy/main',
            'sammy.push_location_proxy': '/vendor2/sammy.push_location_proxy',
            'text': '/vendor2/require-text',
            'inflector': '/vendor2/underscore.inflection',
            'when': '/vendor2/when',
            'knockout.validation': '/vendor/knockout.validation/Dist/knockout.validation',
            'knockout-bootstrap': vendor2ed('knockout-bootstrap'),
            'jquery.cookie': '/vendor/jquery.cookie/jquery.cookie',
            'json': '/vendor2/require-json',
            'nprogress': '/vendor/nprogress/nprogress',
        },
        map: {
            '*': {
                knockout: 'knockout-shim'
            },
            'knockout-shim': {
                knockout: 'knockout'
            },
            'knockout-projections': {
                knockout: 'knockout'
            },
            'knockout-bootstrap': {
                knockout: 'knockout'
            },
            'inflector': {
                underscore: 'lodash'
            }
        },
        shim: {
            bootstrap: {
                deps: ['jquery'],
                exports: '$'
            },
            'knockout-bootstrap': {
                deps: ['bootstrap', 'jquery']
            },
            jStorage: {
                exports: '$.jStorage'
            }
        },
        enforceDefine: true
    });

    define(['app', 'pages/' + document.getElementById('require').dataset.page], function () {
    });
})();
