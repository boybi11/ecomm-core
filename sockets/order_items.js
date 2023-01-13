// models
const OrderItem = require('../models/OrderItem');
const ProductRating = require('../models/ProductRating');

module.exports = {
    getUnitSoldRankings: (params, callback) => {
        new OrderItem()
            .with(["product:asset->rating_stats"])
            .select(['product_id', "COUNT(product_id) as count"])
            .whereRaw(`(status != "cart" OR status != "cancelled" OR status != "refunded")`)
            .max(params.size ? params.size : 5)
            .groupBy("product_id")
            .orderBy("count", params.sort ? params.sort : "DESC")
            .get(function(err, res) {
                callback(res);
            });
    },

    getUnitSalesRankings: (params, callback) => {
        new OrderItem()
            .with(["product:asset->rating_stats"])
            .select(['product_id', "SUM(price * quantity) as count"])
            .whereRaw(`(status != "cart" OR status != "cancelled" OR status != "refunded")`)
            .max(params.size ? params.size : 5)
            .groupBy("product_id")
            .orderBy("count", params.sort ? params.sort : "DESC")
            .get(function(err, res) {
                callback(res);
            });
    },

    getUnitRatingRankings: (params, callback) => {
        new ProductRating()
            .with(["product:asset->rating_stats"])
            .select(['product_id', "SUM(rating) as count"])
            .max(params.size ? params.size : 5)
            .groupBy("product_id")
            .orderBy("count", params.sort ? params.sort : "DESC")
            .get(function(err, res) {
                callback(res);
            });
    }
}