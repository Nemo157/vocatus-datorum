define(['lodash', 'jquery', 'knockout'], function ( _, $, ko) {
    var Pager = function (logger) {
        this.logger = logger;
        this.pages = ko.observableArray();
        this.currentPage = ko.observable();
        this.last_page = ko.observable();
    };

    Pager.prototype.ensurePageLoaded = function (id, path, params, forceRefresh) {
        var pageHolder = _.find(this.pages(), { id: id });
        if (pageHolder) {
            pageHolder.params = params;
            if (pageHolder.model() && pageHolder.model().refresh) {
                pageHolder.model().refresh(params, forceRefresh);
            }
        } else {
            this.loadPage(path, id, params);
        }
    };

    Pager.prototype.goToPage = function (path, params, originalPath) {
        var id = path.replace(/\//g, '-');
        this.ensurePageLoaded(id, path, params, true);
        this.last_page(this.currentPage());
        this.currentPage({
            id: id,
            path: path,
            originalPath: originalPath
        });
    };

    Pager.prototype.loadPage = function (path, id, params) {
        var pageHolder = {
            id: id,
            templateLoaded: ko.observable($('#' + id).length > 0),
            model: ko.observable(),
            params: params
        };
        pageHolder.loaded = ko.computed(function () {
            return pageHolder.templateLoaded() && !!pageHolder.model();
        });
        pageHolder.ready = ko.computed(function () {
            return pageHolder.loaded() && (!pageHolder.model().ready || pageHolder.model().ready());
        });
        pageHolder.isCurrentPage = ko.computed(function () {
            return this.currentPage() && this.currentPage().id === pageHolder.id;
        }, this);
        if (!pageHolder.templateLoaded()) {
            require(['text!templates/' + path + '.html'], _.bind(this.pageTemplateLoaded, this, pageHolder), _.bind(this.pageTemplateLoadFailed, this, pageHolder));
        }
        require(['pages/' + path], _.bind(this.pageModelLoaded, this, pageHolder), _.bind(this.pageModelLoadFailed, this, pageHolder));
        this.pages.push(pageHolder);
    };

    Pager.prototype.pageModelLoaded = function (pageHolder, pageModel) {
        if (pageModel && pageModel.refresh) {
            pageModel.refresh(pageHolder.params);
        }
        pageModel.app = this;
        pageHolder.model(pageModel);
    };

    Pager.prototype.pageTemplateLoaded = function (pageHolder, pageTemplate) {
        if (_.isString(pageTemplate)) {
            $('body').append($('<script>').attr({ id: pageHolder.id, type: 'text/html' }).text(pageTemplate));
        }
        pageHolder.templateLoaded(true);
    };

    Pager.prototype.pageModelLoadFailed = function (pageHolder, error) {
        this.logger.log("Failed to load model for page " + pageHolder.id + ", using an empty one");
        this.logger.log(error);
        this.pageModelLoaded(pageHolder, {});
    };

    Pager.prototype.pageTemplateLoadFailed = function (pageHolder, error) {
        if (true /* in development */) {
            this.logger.log("Failed to load template for page " + pageHolder.id + ", injecting error message");
            this.logger.log(error);
            var message = error.toString();
            var wrapped = '<div class="container"><div class="alert alert-danger"><strong>Error loading template for page ' + pageHolder.id + ':</strong> ' + message + '</div></div>';
            if (error.xhr) {
                this.pageTemplateLoaded(pageHolder, wrapped + error.xhr.responseText);
            } else {
                this.pageTemplateLoaded(pageHolder, wrapped);
            }
        } else {
            this.logger.log("Failed to load template for page " + pageHolder.id + ", using an empty one");
            this.logger.log(error);
            this.pageTemplateLoaded(pageHolder, '');
        }
    };

    return Pager;
});
