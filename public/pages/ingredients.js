define([
    'models/ingredient',
    './entities'
], function (
    Ingredient,
    EntitiesPage
) {
    return new EntitiesPage({
        model: Ingredient,
        url: '/api/ingredients'
    });
});
