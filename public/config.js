/* global requirejs */
(function () {
    var choose = function (production, development) {
        return development;
    };

    requirejs.config({
        baseUrl: '/',
        paths: {
            'jquery': choose(
                '//code.jquery.com/jquery-1.10.2.min',
                '//code.jquery.com/jquery-1.10.2'
            ),
            'bootstrap': choose(
                '//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min',
                '//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap'
            ),
            'lodash': choose(
                '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
                '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash'
            ),
            'postal': choose(
                '//cdnjs.cloudflare.com/ajax/libs/postal.js/0.8.5/postal.min',
                '//cdnjs.cloudflare.com/ajax/libs/postal.js/0.8.5/postal'
            ),
            'knockout': choose(
                '//cdnjs.cloudflare.com/ajax/libs/knockout/3.0.0/knockout-min',
                '//cdnjs.cloudflare.com/ajax/libs/knockout/3.0.0/knockout-debug'
            ),
            'knockout-projections': choose(
                '//rawgithub.com/mariusGundersen/knockout-projections/amd/dist/knockout-projections-1.0.0.min',
                '//rawgithub.com/mariusGundersen/knockout-projections/amd/dist/knockout-projections-1.0.0'
            ),
            'knockout.mapping': choose(
                '//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping',
                '//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping'
            ),
            'jStorage': '//cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.4/jstorage.min',
            'sammy': choose(
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/min/sammy.min',
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/sammy'
            ),
            'sammy.push_location_proxy': choose(
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/min/plugins/sammy.push_location_proxy.min',
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/plugins/sammy.push_location_proxy'
            ),
            'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
            'inflector': '//rawgithub.com/Nemo157/underscore.inflection/master/src/underscore.inflection',
            'when': '//cdnjs.cloudflare.com/ajax/libs/when/2.7.1/when',
            'knockout.validation': choose(
                '//rawgithub.com/Knockout-Contrib/Knockout-Validation/master/Dist/knockout.validation.min',
                '//rawgithub.com/Knockout-Contrib/Knockout-Validation/master/Dist/knockout.validation'
            ),
            'knockout-bootstrap': choose(
                '//rawgithub.com/billpull/knockout-bootstrap/master/build/knockout-bootstrap.min',
                '//rawgithub.com/billpull/knockout-bootstrap/master/src/knockout-bootstrap'
            ),
            'jquery.cookie': choose(
                '//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.0/jquery.cookie.min',
                '//cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.0/jquery.cookie'
            ),
            'json': '//rawgithub.com/millermedeiros/requirejs-plugins/v1.0.2/src/json'
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
