const ShippingFee = require('../models/ShippingFee');
const ShippingZone = require('../models/ShippingZone');

class ShippingFeeHelper {

    getProvinceShippingFee(provinceId, res) {
        if (provinceId) {
            new ShippingZone()
                .where({province_id: {value: provinceId}})
                .get(function(gErr, gRes) {
                    if (gErr) {
                        res.status(400).send("Something went wrong with your request!");
                    } else {
                        if (gRes && gRes.length) {
                            new ShippingFee()
                                .with("rates")
                                .whereIn({id: gRes.map(g => g.shipping_fee_id)})
                                .get(function(gErr2, gRes2) {
                                    if (gRes2 && gRes2.length) {
                                        res.send(gRes2);
                                    } else {
                                        res.status(204).send([]);
                                    }
                                });
                        } else {
                            res.status(204).send([]);
                        }
                    }
                });
        } else {
            res.status(204).send([]);
        }
    }
};

module.exports = new ShippingFeeHelper;