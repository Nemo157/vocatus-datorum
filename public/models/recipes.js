define([
    'lodash',
    'knockout',
    './recipe',
    './entities',
    'models/cocktail'
], function (
    _,
    ko,
    Recipe,
    EntityListType
) {
    return new EntityListType({
        name: 'recipes',
        model: Recipe,
        init: function () {
            this.new_url = ko.computed(_.bind(_.template('${url()}/new'), _, this));
        }
    });
});
