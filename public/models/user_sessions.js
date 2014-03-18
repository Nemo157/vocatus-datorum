define([
    'knockout',
    './entities',
    './user_session'
], function (
    ko,
    EntityListType,
    UserSession
) {
    return new EntityListType({
        name: 'user_sessions',
        model: UserSession
    });
});
