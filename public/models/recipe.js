define([
    './entity',
    './quantified_ingredients'
], function (
    EntityType,
    QuantifiedIngredientList
) {
    return new EntityType({
        name: 'recipe',
        mapping: {
            ingredients: QuantifiedIngredientList.mapping
        },
        afterRefresh: function () {
            if (this.ingredients) {
                this.ingredients.refresh();
            }
        }
    });
});
