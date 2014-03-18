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
        this.ready = ko.computed(function () {
            return !!this.cocktail();
        }, this);
    };

    ShowCocktail.prototype.refresh = function (params) {
        var cocktail = Cocktail.get(params.cocktail_id);
        if (cocktail.loaded) {
            this.cocktail(cocktail);
            cocktail.refresh();
        } else {
            this.cocktail(null);
            cocktail.refresh().then(this.cocktail);
        }
    };

    return new ShowCocktail();
});
