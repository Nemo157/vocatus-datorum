define([
    './entities',
    'models/cocktail'
], function (
    EntityListType
) {
    return new EntityListType({
        name: 'cocktails'
    });
});
