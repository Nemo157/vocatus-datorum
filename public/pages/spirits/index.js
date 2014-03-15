define([
    'models/spirit',
    'pages/entities/index'
], function (
    Spirit,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Spirit,
        url: '/api/spirits'
    });
});
