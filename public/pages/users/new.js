define([
    'jquery',
    'knockout',
    'knockout.validation',
    'app',
    'models/user',
    'models/user_session'
], function (
    $,
    ko,
    validation,
    app,
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
                if (data.error) {
                    alert(JSON.stringify(data.errors));
                } else {
                    var user = User.create(data);
                    $.ajax({
                        type: 'POST',
                        url: user.user_sessions().uri(),
                        data: JSON.stringify({}),
                        contentType: 'application/json',
                        processData: false
                    }).done(function (data) {
                        app.user(user);
                        app.session(UserSession.create(data));
                        app.router.redirect((app.pager.last_page() && app.pager.last_page().originalPath) || '/');
                    });
                }
            });
        }
    });

    return registerPage();
});
