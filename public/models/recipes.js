define([
    './recipe',
    './entities'
], function (
    Recipe,
    EntityListType
) {
    return new EntityListType({
        name: 'recipes',
        model: Recipe
    });
});
