define([
    'lodash',
    'knockout',
    './entity',
    'models/recipes'
], function (
    _,
    ko,
    EntityType
) {
    return new EntityType({
        name: 'cocktail',
        mapping: {
            recipes: 'models/recipes'
        },
        init: function () {
            this.edit_url = ko.computed(_.bind(_.template('/${model.plural_name}/${id()}/edit'), _, this));
        },
        afterRefresh: function () {
            if (this.recipes) {
                this.recipes.refresh();
            }
        }
    });
});
