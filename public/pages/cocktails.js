define([
    'jquery',
    'knockout',
    'knockout.mapping',
    'models/cocktail'
], function (
    $,
    ko,
    mapping,
    Cocktail
) {
    var page = {
        cocktails: ko.observableArray(),
        refresh: function () {
            $.get('/api/cocktails', function (data) {
                mapping.fromJS(data.items, Cocktail.mapping, page.cocktails);
            });
        }
    };

    return page;
});
