define([
    'jquery',
    'knockout',
    'knockout.validation',
    'when',
    'app',
    'models/user',
    'models/user_session'
], function (
    $,
    ko,
    validation,
    when,
    app,
    User,
    UserSession
) {
    return ko.validatedObservable({
        email: ko.observable(),
        isProcessing: ko.observable(),
        register: function () {
            this.isProcessing(true);
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
                    this.isProcessing(false);
                } else {
                    var user = User.create(data);
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
                        });
                    });
                }
            }, this);
        }
    })();
});
