define([
    'jquery',
    'lodash',
    'knockout',
    'knockout.validation',
    'when',
    'app',
    'models/users',
    'models/user_session'
], function (
    $,
    _,
    ko,
    validation,
    when,
    app,
    UserList,
    UserSession
) {
    return ko.validatedObservable({
        email: ko.observable(),
        isProcessing: ko.observable(),
        login: function () {
            this.isProcessing(true);
            var userList = UserList.get();
            userList.refresh().then(function (userList) {
                return when.all(_.map(userList.items(), function (item) {
                    return item.refresh();
                }));
            }).done(_.bind(this.onUserListRefreshed, this));
        },
        onUserListRefreshed: function (users) {
            var user = _.find(users, function (user) {
                return user.email() === this.email();
            }, this);
            if (user) {
                $.ajax({
                    type: 'POST',
                    url: user.user_sessions().uri(),
                    data: JSON.stringify({}),
                    contentType: 'application/json',
                    processData: false
                }).done(function (data) {
                    var session = UserSession.create(data);
                    app.user(user);
                    app.session(session);
                    when.all([user.refresh(), session.refresh()], function () {
                        app.router.redirect((app.pager.last_page() && app.pager.last_page().originalPath) || '/');
                        this.isProcessing(false);
                    }, this);
                }, this);
            } else {
                alert("User not found");
                this.isProcessing(false);
            }
        }
    })();
});
