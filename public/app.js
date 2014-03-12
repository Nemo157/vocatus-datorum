/* global requirejs */
requirejs.config({
    paths: {
        jquery: '//code.jquery.com/jquery-1.10.2.min',
        bootstrap: '//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min',
        lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
        postal: '//cdnjs.cloudflare.com/ajax/libs/postal.js/0.8.5/postal.min',
        knockout: '//cdnjs.cloudflare.com/ajax/libs/knockout/3.0.0/knockout-min',
        'knockout-projections': '//rawgithub.com/mariusGundersen/knockout-projections/amd/dist/knockout-projections-1.0.0.min',
        'knockout.mapping': '//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping',
        jStorage: '//cdnjs.cloudflare.com/ajax/libs/jStorage/0.4.4/jstorage.min',
        sammy: '//rawgithub.com/quirkey/sammy/master/lib/min/sammy-0.7.5.min',
        'sammy.push_location_proxy': '//rawgithub.com/quirkey/sammy/master/lib/min/plugins/sammy.push_location_proxy-0.7.5.min'
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

require(['app/main.js']);
