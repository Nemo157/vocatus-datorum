define([
    'models/spirit',
    './entities'
], function (
    Spirit,
    EntitiesPage
) {
    return new EntitiesPage({
        model: Spirit,
        url: '/api/spirits'
    });
});
