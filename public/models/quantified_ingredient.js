define([
    './entity',
    'models/ingredient'
], function (
    EntityType
) {
    return new EntityType({
        name: 'quantified_ingredient',
        mapping: {
            ingredient: 'models/ingredient'
        },
        afterRefresh: function () {
            if (this.ingredient && this.ingredient()) {
                this.ingredient().refresh();
            }
        }
    });
});
