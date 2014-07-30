define([
    'jquery',
    'lodash',
    'knockout',
    'knockout.validation',
    'app',
    'models/users',
    'models/user_session'
], function (
    $,
    _,
    ko,
    validation,
    app,
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

    return loginPage();
});
