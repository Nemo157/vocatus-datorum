define([
    './entity',
    'models/cocktails'
], function (
    EntityType
) {
    return new EntityType({
        name: 'ingredient',
        mapping: {
            cocktails_used_in: 'models/cocktails'
        }
    });
});
