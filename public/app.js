/* global console */
define([
    'lodash',
    'jquery',
    'knockout',
    'knockout.validation',
    'require',
    'bootstrap',
    'router',
    'jquery.cookie',
    'models/user_sessions',
    'models/user',
    'preloader',
    'fade'
], function (
    _,
    $,
    ko,
    validation,
    require,
    bootstrap,
    router,
    cookie,
    UserSessions,
    User,
    Preloader
) {
    validation.init({
        insertMessages: false,
        decorateElement: true,
        errorElementClass: 'has-error',
        parseInputAttributes: true
    });

    var app = {
        pages: ko.observableArray(),
        current_page: ko.observable(),
        last_page: ko.observable(),
        user: ko.observable({
            email: ko.observable(),
            logged_in: ko.observable(false),
            can_edit: ko.observable(false)
        }),
        session: ko.observable(),
        logout: function () {
            if (this.session()) {
                $.ajax({
                    type: 'DELETE',
                    url: this.session().uri()
                });
                if (this.current_page().id === 'user_sessions-show') {
                    var pageHolder = _.find(this.pages(), { id: 'user_sessions-show' });
                    if (pageHolder.params.user_session_id === this.session().id()) {
                        router.redirect('/');
                    }
                }
                this.session(null);
                this.user({
                    email: ko.observable(),
                    logged_in: ko.observable(false),
                    can_edit: ko.observable(false)
                });
            }
        },
        ensurePageLoaded: function (id, path, params) {
            var pageHolder = _.find(this.pages(), { id: id });
            if (pageHolder) {
                pageHolder.params = params;
                if (pageHolder.model() && pageHolder.model().refresh) {
                    pageHolder.model().refresh(params);
                }
            } else {
                this.loadPage(path, id, params);
            }
        },
        goToPage: function (path, params, originalPath) {
            var id = path.replace(/\//g, '-');
            this.ensurePageLoaded(id, path, params);
            this.last_page(this.current_page());
            this.current_page({
                id: id,
                path: path,
                originalPath: originalPath
            });
        },
        loadPage: function (path, id, params) {
            var pageHolder = {
                id: id,
                templateLoaded: ko.observable($('#' + id).length > 0),
                model: ko.observable(),
                params: params
            };
            pageHolder.loaded = ko.computed(function () {
                return pageHolder.templateLoaded() && !!pageHolder.model();
            });
            pageHolder.ready = ko.computed(function () {
                return pageHolder.loaded() && (!pageHolder.model().ready || pageHolder.model().ready());
            });
            if (!pageHolder.templateLoaded()) {
                require(['text!templates/' + path + '.html'], _.bind(this.pageTemplateLoaded, this, pageHolder), _.bind(this.pageTemplateLoadFailed, this, pageHolder));
            }
            require(['pages/' + path], _.bind(this.pageModelLoaded, this, pageHolder), _.bind(this.pageModelLoadFailed, this, pageHolder));
            this.pages.push(pageHolder);
        },
        pageModelLoaded: function (pageHolder, pageModel) {
            if (pageModel && pageModel.refresh) {
                pageModel.refresh(pageHolder.params);
            }
            pageModel.app = this;
            pageHolder.model(pageModel);
        },
        pageTemplateLoaded: function (pageHolder, pageTemplate) {
            if (_.isString(pageTemplate)) {
                $('body').append($('<script>').attr({ id: pageHolder.id, type: 'text/html' }).text(pageTemplate));
            }
            pageHolder.templateLoaded(true);
        },
        pageModelLoadFailed: function (pageHolder, error) {
            console.log("Failed to load model for page " + pageHolder.id + ", using an empty one");
            console.log(error);
            this.pageModelLoaded(pageHolder, {});
        },
        pageTemplateLoadFailed: function (pageHolder, error) {
            if (true /* in development */) {
                console.log("Failed to load template for page " + pageHolder.id + ", injecting error message");
                console.log(error);
                var message = error.toString();
                var wrapped = '<div class="container"><div class="alert alert-danger"><strong>Error loading template for page ' + pageHolder.id + ':</strong> ' + message + '</div></div>';
                if (error.xhr) {
                    this.pageTemplateLoaded(pageHolder, wrapped + error.xhr.responseText);
                } else {
                    this.pageTemplateLoaded(pageHolder, wrapped);
                }
            } else {
                console.log("Failed to load template for page " + pageHolder.id + ", using an empty one");
                console.log(error);
                this.pageTemplateLoaded(pageHolder, '');
            }
        }
    };

    if ($.cookie('session_id')) {
        var session_id = $.cookie('session_id');
        UserSessions.get().refresh().done(function (sessions) {
            var session = _.find(sessions.items(), function (session) {
                return session.client_id() === session_id;
            });
            if (session) {
                app.session(session);
                var user = User.create({ uri: session.user.uri });
                user.refresh().done(app.user);
            }
        });
    }

    app.session.subscribe(function (session) {
        if (session && session.client_id()) {
            $.cookie('session_id', session.client_id());
        } else {
            $.removeCookie('session_id');
        }
    });

    router.setApp(app);
    router.run();

    app.preloader = new Preloader(router, app);

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
