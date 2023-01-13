// models
const CouponFreeShippingZone = require('../models/CouponFreeShippingZone');

class CouponHelper {

    syncFreeShippingZones = async (couponId, provinces = []) => {
        if (couponId) {
            let coupon = new CouponFreeShippingZone();
            if (Array.isArray(couponId)) coupon = coupon.whereIn({coupon_id: couponId});
            else coupon = coupon.where({coupon_id: {value: couponId}});
                
            await coupon.delete([])
            if (provinces) await new CouponFreeShippingZone().create(provinces);
        }

        return true
    }
}

module.exports = new CouponHelper;