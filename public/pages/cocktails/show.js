define([
    'lodash',
    'jquery',
    'knockout',
    'knockout.mapping',
    'models/cocktail'
], function (
    _,
    $,
    ko,
    mapping,
    Cocktail
) {
    var ShowCocktail = function () {
        _.bindAll(this);
        this.cocktail = ko.observable();
    };

    ShowCocktail.prototype.refresh = function (params) {
        var cocktail = Cocktail.get(params.id);
        if (cocktail.loaded) {
            this.cocktail(cocktail);
            cocktail.refresh();
        } else {
            this.cocktail(null);
            cocktail.refresh().done(this.cocktail);
        }
    };

    return new ShowCocktail();
});
