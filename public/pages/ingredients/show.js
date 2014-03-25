define([
    'pages/entities/show',
    'models/ingredient'
], function (
    ShowPage,
    Ingredient
) {
    return new ShowPage({
        name: 'ingredient',
        model: Ingredient
    });
});
