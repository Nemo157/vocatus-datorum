define([
    'lodash',
    'jquery',
    'knockout'
], function (
    _,
    $,
    ko
) {
    var fadeDataKey = ko.utils.domData.nextKey();
    var fadeContextDataKey = ko.utils.domData.nextKey();

    var contexts = {};

    var fade = function (element) {
        var data = ko.utils.domData.get(element, fadeDataKey);
        var context = contexts[data.contextId];
        if (!context.transitioning) {
            context.transitioning = true;
            data.isDisplayed = false;
            // This only works because of the defer below.
            $(element).fadeOut(context.nextPage ? 'fast' : 'slow', onFaded);
        }
    };

    var show = function (element, bindingContext) {
        var data = ko.utils.domData.get(element, fadeDataKey);
        var context = contexts[data.contextId];
        if (!context.transitioning) {
            context.transitioning = true;
            if (!data.isBound) {
                if (data.savedNodes) {
                    ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(data.savedNodes));
                }
                ko.applyBindingsToDescendants(bindingContext, element);
                data.isBound = true;
            }
            data.isDisplayed = true;
            // Give the page more time to load on first show.
            $(element).fadeIn(data.beenShown ? 'fast' : 'slow', onShown);
            data.beenShown = true;
        }
    };

    var onFaded = function () {
        var data = ko.utils.domData.get(this, fadeDataKey);
        var context = contexts[data.contextId];
        context.transitioning = false;
        if (!data.savedNodes) {
            data.savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(this), true);
        }
        ko.virtualElements.emptyNode(this);
        data.isBound = false;
        if (context.nextPage) {
            show(context.nextPage, context.nextBindingContext);
        }
    };

    var onShown = function () {
        var data = ko.utils.domData.get(this, fadeDataKey);
        var context = contexts[data.contextId];
        context.transitioning = false;
        context.previousPage = this;
        if (this === context.nextPage) {
            context.nextPage = null;
        } else {
            fade(this);
        }
    };

    var findContextId = function (element, value) {
        var contextId = value && value.context;
        if (!contextId) {
            var parent = $(element).parent()[0];
            contextId = ko.utils.domData.get(parent, fadeContextDataKey);
            if (!contextId) {
                contextId = ko.utils.domData.nextKey();
                ko.utils.domData.set(parent, fadeContextDataKey, contextId);
            }
        }
        if (!contexts[contextId]) {
            contexts[contextId] = {};
        }
        return contextId;
    };

    ko.bindingHandlers.fade = {
        fadeDataKey: fadeDataKey,
        fadeContextDataKey: fadeContextDataKey,
        contexts: contexts,
        init: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            var shouldDisplay = _.isBoolean(value) ? value : _.has(value, 'shouldDisplay') && value.shouldDisplay;
            $(element).toggle(shouldDisplay);
            ko.utils.domData.set(element, fadeDataKey, {
                contextId: findContextId(element, value)
            });
            return { 'controlsDescendantBindings': true };
        },
        update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
            var data = ko.utils.domData.get(element, fadeDataKey);
            var context = contexts[data.contextId];
            var value = ko.utils.unwrapObservable(valueAccessor());
            var shouldDisplay = _.isBoolean(value) ? value : _.has(value, 'shouldDisplay') && value.shouldDisplay;

            if (shouldDisplay !== data.isDisplayed) {
                if (shouldDisplay) {
                    context.nextPage = element;
                    context.nextBindingContext = bindingContext;
                    if (data.savedNodes) {
                        ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(data.savedNodes));
                    }
                    ko.applyBindingsToDescendants(bindingContext, element);
                    data.isBound = true;
                    if (context.previousPage) {
                        fade(context.previousPage);
                    } else {
                        show(element, bindingContext);
                    }
                } else {
                    // Ensures the new page being shown will have higher
                    // priority so we can adjust the fade speed depending
                    // on whether there is a new page or not.
                    _.defer(function() { fade(element); });
                }
            }
        }
    };

    return ko.bindingHandlers.fade;
});
