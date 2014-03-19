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
    'pager',
    'fade'
], function (
    _,
    $,
    ko,
    validation,
    require,
    bootstrap,
    Router,
    cookie,
    UserSessions,
    User,
    Preloader,
    Pager
) {
    validation.init({
        insertMessages: false,
        decorateElement: true,
        errorElementClass: 'has-error',
        parseInputAttributes: true
    });

    var app = {
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
                if (this.pager.currentPage().id === 'user_sessions-show') {
                    var pageHolder = _.find(this.pager.pages(), { id: 'user_sessions-show' });
                    if (pageHolder.params.user_session_id === this.session().id()) {
                        this.router.redirect('/');
                    }
                }
                this.session(null);
                this.user({
                    email: ko.observable(),
                    logged_in: ko.observable(false),
                    can_edit: ko.observable(false)
                });
            }
        }
    };

    app.logger = {
        log: _.bind(console.log, console)
    };
    app.pager = new Pager(app.logger);
    app.router = new Router(app, app.pager);
    app.preloader = new Preloader(app.router, app.pager);

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

    app.router.run();

    ko.applyBindings(app);
    $('body').removeClass('loading');

    return app;
});
