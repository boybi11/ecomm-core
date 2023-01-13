
module.exports = function(apiRoutes, { PageController, PageContentController, PageClientContentController }, { AuthMiddleware }) {

    // PAGES
    apiRoutes.get('/backoffice/pages', AuthMiddleware.auth, PageController.get);
    apiRoutes.post('/backoffice/pages', AuthMiddleware.auth, PageController.store);
    apiRoutes.get('/backoffice/pages/:id', AuthMiddleware.auth, PageController.edit);
    apiRoutes.patch('/backoffice/pages/:id', AuthMiddleware.auth, PageController.update);
    apiRoutes.delete('/backoffice/pages', AuthMiddleware.auth, PageController.delete);

    // PAGE CONTENTS
    apiRoutes.get('/backoffice/page-contents', AuthMiddleware.auth, PageContentController.get);
    apiRoutes.get('/backoffice/page-contents/:slug', AuthMiddleware.auth, PageContentController.edit);

    // PAGE CLIENT CONTENTS
    apiRoutes.get('/backoffice/page-client-contents/:contentId', AuthMiddleware.auth, PageClientContentController.get);
    apiRoutes.post('/backoffice/page-client-content', AuthMiddleware.auth, PageClientContentController.store);
    apiRoutes.get('/backoffice/page-client-content/:id', AuthMiddleware.auth, PageClientContentController.edit);
    apiRoutes.patch('/backoffice/page-client-content/:id', AuthMiddleware.auth, PageClientContentController.update);
    apiRoutes.delete('/backoffice/page-client-contents/:contentId', AuthMiddleware.auth, PageClientContentController.delete);
    apiRoutes.patch('/backoffice/page-client-contents-reorder', AuthMiddleware.auth, PageClientContentController.reorder);

    return apiRoutes;
};