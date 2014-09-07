define([
    'jquery',
    'knockout',
    'knockout.mapping',
    'knockout.validation',
    'when',
    'app',
    'models/ingredient'
], function (
    $,
    ko,
    mapping,
    validation,
    when,
    app,
    Ingredient
) {
    return ko.observable({
        ingredient: ko.validatedObservable({
            name: ko.observable(),
            image_url: ko.observable(),
            description: ko.observable(),
        }),
        isProcessing: ko.observable(),
        save: function () {
            var self = this;
            this.isProcessing(true);
            $.ajax({
                type: 'POST',
                url: '/api/ingredients',
                data: mapping.toJSON(this.ingredient),
                contentType: 'application/json',
                processData: false
            }).done(function (data) {
                if (data.error) {
                    alert(JSON.stringify(data.errors));
                } else {
                    var ingredient = Ingredient.create(data);
                    app.router.redirect(ingredient.url());
                }
                self.isProcessing(false);
            }, this);
        }
    })();
});
