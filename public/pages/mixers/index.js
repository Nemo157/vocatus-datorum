define([
    'models/mixer',
    'pages/entities/index'
], function (
    Mixer,
    EntitiesIndex
) {
    return new EntitiesIndex({
        model: Mixer,
        url: '/api/mixers'
    });
});
