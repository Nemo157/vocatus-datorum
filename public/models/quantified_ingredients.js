define([
    './quantified_ingredient',
    './entities'
], function (
    QuantifiedIngredient,
    EntityListType
) {
    return new EntityListType({
        name: 'quantified_ingredients',
        model: QuantifiedIngredient
    });
});
