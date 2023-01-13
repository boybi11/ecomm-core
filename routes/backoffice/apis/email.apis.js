module.exports = function(apiRoutes, { EmailController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/emails', AuthMiddleware.auth, EmailController.get);
    apiRoutes.post('/backoffice/emails', AuthMiddleware.auth, EmailController.store);
    apiRoutes.get('/backoffice/emails/:id', AuthMiddleware.auth, EmailController.edit);
    apiRoutes.patch('/backoffice/emails/:id', AuthMiddleware.auth, EmailController.update);
    apiRoutes.patch('/backoffice/emails/resend/:id', AuthMiddleware.auth, EmailController.resend);
    apiRoutes.delete('/backoffice/emails', AuthMiddleware.auth, EmailController.delete);

    apiRoutes.get('/backoffice/email/test-view', AuthMiddleware.auth, EmailController.testView);

    return apiRoutes;
};