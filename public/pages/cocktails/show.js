define([
    'pages/entities/show',
    'models/cocktail'
], function (
    ShowPage,
    Cocktail
) {
    return new ShowPage({
        name: 'cocktail',
        model: Cocktail
    });
});
