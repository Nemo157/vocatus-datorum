define([
    './cocktail',
    './entities'
], function (
    Cocktail,
    EntityListType
) {
    return new EntityListType({
        name: 'cocktails',
        model: Cocktail
    });
});
