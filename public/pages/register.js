define([
    'knockout',
    'knockout.validation',
    'router'
], function (
    ko,
    validation,
    router
) {
    var registerPage = ko.validatedObservable({
        email: ko.observable(),
        register: function () {
            router.redirect('/registered');
        }
    });

    return registerPage;
});
