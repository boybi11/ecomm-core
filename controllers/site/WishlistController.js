const Wishlist = require('../../models/Wishlist');
const moment = require("moment");

class WishlistController {

    get(req, res) {
        const { query } = req;
        new Wishlist()
            .with("product:(asset-category:iconAsset-brand:asset-children)")
            .where({user_id: {value: req.authUser.id}})
            .paginate(query.pageSize, query.page, function (err, result) {
                if (err) res.status(400).send(err);
                else {
                    if (result) res.send(result);
                    else res.status(204).send({});
                }
            });
    }

    store(req, res) {
        new Wishlist()
            .create({...req.body, ...{user_id: req.authUser.id}}, function (err, result) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    if (result) {
                        new Wishlist()
                            .where({id: {value: result.insertId}})
                            .first(function (fErr, fRes) {
                                res.send(fRes);
                            });
                    } else {
                        res.status(204).send({});
                    }
                }
            });
    }

    find(req, res) {
        new Wishlist()
            .with("product")
            .where({
                user_id: {value: req.authUser.id},
                product_id: {value: req.params.product_id},
            })
            .first(function (err, result) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    if (result) {
                        res.send(result);
                    } else {
                        res.status(204).send(null);
                    }
                }
            });
    }

    delete(req, res) {
        new Wishlist()
            .delete([req.body.id], function (err, result) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    if (result) {
                        res.send(result);
                    } else {
                        res.status(204).send({});
                    }
                }
            });
    }
};

module.exports = new WishlistController;