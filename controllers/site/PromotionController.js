const Promotion = require('../../models/Promotion');
const DiscountedProduct = require('../../models/DiscountedProduct');
const moment = require('moment');

class PromotionController {

    get(req, res) {
        let promotions = new Promotion()
                            .with('asset');
                            
        const {query} = req;
        if (query.filters) {
            const now = moment().format("YYYY-MM-DD");
            let publishQuery = "";
            const filters = JSON.parse(query.filters);
            const type = filters.type;

            Object.keys(filters).map(key => {
                filters[key] = {
                    value: `${filters[key]}%`,
                    operation: " LIKE "
                };
            });
            
            if (type === "flash") {
                publishQuery = `(publish_date >= "${now} 00:00:00" AND publish_date <= "${now} 23:59:59")`;
            }
            else {
                publishQuery = `(publish_date <= "${now} 00:00:00" AND (end_date >= "${now} 23:59:59" OR end_date is NULL))`;
            }
            
            promotions = promotions
                            .where(filters)
                            .whereRaw(publishQuery);
        }

        if (query.withProducts) {
            promotions = promotions.with("discountRefs:(product:(asset-children))");
        }

        promotions = promotions.orderBy("publish_date", "ASC");

        promotions.paginate(query.pageSize, query.page, function (err, result) {
            if (err) {
                res.status(500).send(err);
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

module.exports = new PromotionController;