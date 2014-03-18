define([
    'knockout',
    './entity',
    './user_sessions'
], function (
    ko,
    EntityType,
    UserSessions
) {
    return new EntityType({
        name: 'user',
        mapping: {
            user_sessions: UserSessions.mapping
        },
        init: function () {
            this.logged_in = ko.observable(true);
            this.can_edit = ko.observable(true);
        }
    });
});
