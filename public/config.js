/* global requirejs */
(function () {
    var choose = function (production, development) {
        return development;
    };

    requirejs.config({
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
            'jStorage': choose(
                '//cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.4/jstorage.min',
                '//cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.4/jstorage'
            ),
            'sammy': choose(
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/min/sammy.min',
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/sammy'
            ),
            'sammy.push_location_proxy': choose(
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/min/plugins/sammy.push_location_proxy.min',
                '//rawgithub.com/quirkey/sammy/v0.7.5/lib/plugins/sammy.push_location_proxy'
            ),
            'text': choose(
                '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text',
                '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text'
            )
        },
        map: {
            '*': {
                knockout: 'knockout-shim'
            },
            'knockout-shim': {
                knockout: 'knockout'
            },
            'knockout.mapping': {
                knockout: 'knockout'
            },
            'knockout-projections': {
                knockout: 'knockout'
            }
        },
        shim: {
            bootstrap: {
                deps: ['jquery']
            },
            jStorage: {
                exports: '$.jStorage'
            }
        }
    });

    require(['app.js']);
})();