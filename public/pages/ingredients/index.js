define([
    'models/ingredients',
    'pages/entities/index'
], function (
    Ingredients,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Ingredients
    });
});
