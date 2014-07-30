define([
    'knockout',
    './entity'
], function (
    ko,
    EntityType
) {
    return new EntityType({
        name: 'user',
        mapping: {
            user_sessions: 'models/user_sessions'
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
