define([
    'models/ingredient',
    'pages/entities/index'
], function (
    Ingredient,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Ingredient,
        url: '/api/ingredients'
    });
});
