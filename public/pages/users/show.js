define([
    'lodash',
    'jquery',
    'knockout',
    'knockout.mapping',
    'models/user'
], function (
    _,
    $,
    ko,
    mapping,
    User
) {
    var ShowUser = function () {
        _.bindAll(this);
        this.user = ko.observable();
        this.ready = ko.computed(function () {
            return !!this.user();
        }, this);
    };

    ShowUser.prototype.refresh = function (params) {
        var user = User.get(params.user_id);
        if (user.loaded) {
            this.user(user);
            user.refresh();
        } else {
            this.user(null);
            user.refresh().then(this.user);
        }
    };

    return new ShowUser();
});
