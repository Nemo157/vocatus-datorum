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
            this.email = ko.observable();
            this.logged_in = ko.computed(function () {
                return !!this.id();
            }, this);
            this.can_edit = ko.computed(function () {
                return this.logged_in();
            }, this);
        }
    });
});
