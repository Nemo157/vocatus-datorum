define([
    './entity',
    './ingredient'
], function (
    EntityType,
    Ingredient
) {
    return new EntityType({
        name: 'quantified_ingredient',
        mapping: {
            ingredient: Ingredient.observableMapping
        },
        afterRefresh: function () {
            if (this.ingredient && this.ingredient()) {
                this.ingredient().refresh();
            }
        }
    });
});
