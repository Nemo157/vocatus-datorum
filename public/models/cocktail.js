define([
    'lodash',
    'knockout',
    './entity',
    './recipes'
], function (
    _,
    ko,
    EntityType,
    RecipeList
) {
    return new EntityType({
        name: 'cocktail',
        mapping: {
            recipes: RecipeList.mapping
        },
        init: function () {
            this.new_recipe_url = ko.computed(_.bind(_.template('/${model.plural_name}/${id()}/recipes/new'), _, this));
            this.edit_url = ko.computed(_.bind(_.template('/${model.plural_name}/${id()}/edit'), _, this));
        },
        afterRefresh: function () {
            if (this.recipes) {
                this.recipes.refresh();
            }
        }
    });
});
