module.exports = function(apiRoutes, { ImportController }, { AuthMiddleware, UploadMiddleware }) {

    apiRoutes.post('/backoffice/import/validate', AuthMiddleware.auth, UploadMiddleware.uploadInTemp().single("file"), ImportController.validate)

    return apiRoutes;
};