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
        this.cocktail = ko.observable({});
    };

    ShowCocktail.prototype.refresh = function (params) {
        Cocktail.get(params.id).refresh().done(this.cocktail);
    };

    return new ShowCocktail();
});
