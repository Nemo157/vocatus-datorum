define([
    'jquery',
    'knockout',
    'knockout.validation',
    'router',
    'models/user',
    'models/user_session'
], function (
    $,
    ko,
    validation,
    router,
    User,
    UserSession
) {
    var registerPage = ko.validatedObservable({
        email: ko.observable(),
        register: function () {
            $.ajax({
                type: 'POST',
                url: '/api/users',
                data: JSON.stringify({
                    email: this.email()
                }),
                contentType: 'application/json',
                processData: false
            }).done(function (data) {
                var user = User.create(data);
                $.ajax({
                    type: 'POST',
                    url: user.user_sessions.uri(),
                    data: JSON.stringify({}),
                    contentType: 'application/json',
                    processData: false
                }).done(function (data) {
                    registerPage().app.user(user);
                    registerPage().app.session(UserSession.create(data));
                    router.redirect(registerPage().app.last_page().originalPath || '/');
                });
            });
        }
    });

    return registerPage();
});
