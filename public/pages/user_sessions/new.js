define([
    'jquery',
    'lodash',
    'knockout',
    'knockout.validation',
    'router',
    'models/users',
    'models/user_session'
], function (
    $,
    _,
    ko,
    validation,
    router,
    UserList,
    UserSession
) {
    var loginPage = ko.validatedObservable({
        email: ko.observable(),
        login: function () {
            var userList = UserList.get();
            userList.refresh().done(function () {
                var user = _.find(userList.items(), function (user) {
                    return user.email() === loginPage().email();
                });
                if (user) {
                    $.ajax({
                        type: 'POST',
                        url: user.user_sessions.uri(),
                        data: JSON.stringify({}),
                        contentType: 'application/json',
                        processData: false
                    }).done(function (data) {
                        loginPage().app.user(user);
                        loginPage().app.session(UserSession.create(data));
                        router.redirect(loginPage().app.last_page().originalPath || '/');
                    });
                }
            });
        }
    });

    return loginPage();
});
