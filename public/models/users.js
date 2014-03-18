define([
    'knockout',
    './entities',
    './user'
], function (
    ko,
    EntityListType,
    User
) {
    return new EntityListType({
        name: 'users',
        model: User
    });
});
