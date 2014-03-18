define([
    'knockout',
    './entity'
], function (
    ko,
    EntityType
) {
    return new EntityType({
        name: 'user_session'
    });
});
