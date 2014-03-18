define([
    'lodash',
    'jquery',
    'knockout',
    'knockout.mapping',
    'models/user_session'
], function (
    _,
    $,
    ko,
    mapping,
    UserSession
) {
    var ShowUserSession = function () {
        _.bindAll(this);
        this.user_session = ko.observable();
        this.ready = ko.computed(function () {
            return !!this.user_session();
        }, this);
    };

    ShowUserSession.prototype.refresh = function (params) {
        var user_session = UserSession.get(params.user_session_id);
        if (user_session.loaded) {
            this.user_session(user_session);
            user_session.refresh();
        } else {
            this.user_session(null);
            user_session.refresh().then(this.user_session);
        }
    };

    return new ShowUserSession();
});
