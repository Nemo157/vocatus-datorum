define([
    './entities',
    'models/ingredient'
], function (
    EntityListType
) {
    return new EntityListType({
        name: 'ingredients'
    });
});
