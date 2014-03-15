define([
    './ingredient',
    './entities'
], function (
    Ingredient,
    EntityListType
) {
    return new EntityListType({
        name: 'ingredients',
        model: Ingredient
    });
});
