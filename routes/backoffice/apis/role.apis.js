module.exports = function(apiRoutes, { AdminRoleController }, { AuthMiddleware }) {

    apiRoutes.get('/backoffice/admin-roles', AuthMiddleware.auth, AdminRoleController.get);
    apiRoutes.get('/backoffice/admin-roles/list', AuthMiddleware.auth, AdminRoleController.list);
    apiRoutes.post('/backoffice/admin-roles', AuthMiddleware.auth, AdminRoleController.store);
    apiRoutes.get('/backoffice/admin-roles/:id', AuthMiddleware.auth, AdminRoleController.edit);
    apiRoutes.patch('/backoffice/admin-roles/:id', AuthMiddleware.auth, AdminRoleController.update);
    apiRoutes.delete('/backoffice/admin-roles', AuthMiddleware.auth, AdminRoleController.delete);

    return apiRoutes;
};