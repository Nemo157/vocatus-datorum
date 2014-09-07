define([
    'jquery',
    'knockout',
    'knockout.mapping',
    'knockout.validation',
    'when',
    'app',
    'models/user'
], function (
    $,
    ko,
    mapping,
    validation,
    when,
    app,
    User
) {
    var page = {
        user: ko.validatedObservable(),
        isProcessing: ko.observable(),
        save: function () {
            this.isProcessing(true);
            $.ajax({
                type: 'POST',
                url: this.user.uri(),
                data: mapping.toJSON(this.user()),
                contentType: 'application/json',
                processData: false
            }).done(function (data) {
                if (data.error) {
                    alert(JSON.stringify(data.errors));
                    this.isProcessing(false);
                } else {
                    var user = User.create(data);
                    app.router.redirect(user.url());
                    this.isProcessing(false);
                }
            }, this);
        },
        refresh: function (params, forceRefresh) {
            var user = User.get(params.user_id);
            if (user.loaded()) {
                this.user(user);
                if (forceRefresh) {
                    return user.refresh();
                } else {
                    return when(true);
                }
            } else {
                this.user(null);
                return user.refresh().then(this.user);
            }
        }
    };

    page.ready = ko.computed(function () {
        return !!page.user();
    });

    return page;
});
