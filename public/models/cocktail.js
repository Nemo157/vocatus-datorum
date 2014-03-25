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
        }
    });
});
