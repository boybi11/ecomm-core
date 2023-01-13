
module.exports = function(apiRoutes, { AssetController }, { AuthMiddleware }, { UploadHelper }) {

    apiRoutes.get('/backoffice/assets', AuthMiddleware.auth, AssetController.get);
    apiRoutes.get('/backoffice/assets/:ids', AuthMiddleware.auth, AssetController.edit);
    apiRoutes.patch('/backoffice/assets/:id', AuthMiddleware.auth, AssetController.update);
    apiRoutes.get('/backoffice/asset-group', AuthMiddleware.auth, AssetController.getFromGroup);
    apiRoutes.post('/backoffice/assets/init-group', AuthMiddleware.auth, AssetController.initGroup);
    apiRoutes.post('/backoffice/assets/upload-temp', AuthMiddleware.auth, UploadHelper.initUpload().array('files'), AssetController.uploadTemp);
    apiRoutes.post('/backoffice/assets-cleanup', AuthMiddleware.auth, AssetController.cleanTempAssets);
    apiRoutes.post('/backoffice/assets/redactor', AuthMiddleware.auth, UploadHelper.initUpload().single('image'), AssetController.uploadRedactor);
    apiRoutes.delete('/backoffice/assets', AuthMiddleware.auth, AssetController.delete);
    
    return apiRoutes;
};  