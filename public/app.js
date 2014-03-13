/* global console */
define([
    'lodash',
    'jquery',
    'knockout',
    'sammy',
    'require',
    'bootstrap',
    'sammy.push_location_proxy'
], function (
    _,
    $,
    ko,
    sammy,
    require,
    bootstrap,
    PushLocationProxy
) {
    var app = {
        pages: {},
        current_page: ko.observable(),
        current_user: {
            logged_in: ko.observable(false),
            can_edit: ko.observable(false)
        },
        goToPage: function (page) {
            if (this.pages[page]) {
                var pageModel = this.pages[page]();
                if (pageModel && pageModel.load) {
                    pageModel.load();
                }
            } else {
                this.loadPage(page);
            }
            this.current_page(page);
        },
        loadPage: function (page) {
            this.pages[page] = ko.observable();
            var scripts = ['pages/' + page];
            if ($('#' + page).length === 0) {
                scripts.push('text!templates/' + page + '.html');
            }
            require(scripts, _.bind(this.pageLoaded, this, page), _.bind(this.pageLoadFailed, this, page));
        },
        pageLoaded: function (page, pageModel, pageTemplate) {
            if (pageModel && pageModel.load) {
                pageModel.load();
            }
            if (_.isString(pageTemplate)) {
                $('body').append($('<script>').attr({ id: page, type: 'text/html' }).text(pageTemplate));
            }
            this.pages[page](pageModel);
        },
        pageLoadFailed: function (page, error) {
            console.log("Failed to load page " + page);
            console.log(error);
        }
    };

    sammy(function() {
        this.setLocationProxy(new PushLocationProxy(this));

        this.get('/', function () {
            app.goToPage('index');
        });

        this.get('/:page/:id', function () {
            app.goToPage(this.params.page);
        });

        this.get('/:page', function () {
            app.goToPage(this.params.page);
        });
    }).run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
