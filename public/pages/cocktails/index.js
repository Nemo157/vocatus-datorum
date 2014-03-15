define([
    'models/cocktail',
    'pages/entities/index'
], function (
    Cocktail,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Cocktail,
        url: '/api/cocktails'
    });
});
