define([
    './spirit',
    './entities'
], function (
    Spirit,
    EntityListType
) {
    return new EntityListType({
        name: 'spirits',
        model: Spirit
    });
});
