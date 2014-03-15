define([
    'models/mixers',
    'pages/entities/index'
], function (
    Mixers,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Mixers
    });
});
