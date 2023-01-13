const Brand = require('../../models/Brand');
const moment = require('moment');
//helpers
const AssetHelper = require('../../helpers/AssetHelper');
const GeneralHelper = require('../../helpers/GeneralHelper');

class BrandController {

    get(req, res) {
        let brands = new Brand()
                            .with('asset')
                            .where({publish_date: {value: moment().format('YYYY-MM-DD'), operation: "<="}});
                            
        const {query} = req;

        if (query.filters) {
            const filters = JSON.parse(query.filters);
            Object.keys(filters).map(key => {
                if (key !== "published") {
                    filters[key] = {
                        value: `${filters[key]}%`,
                        operation: " LIKE "
                    };
                }
            });
            
            brands = brands.where(filters);
        }

        if (query.ids) {
            brands = brands.whereIn({id: query.ids});
        }

        if (query.sort && Array.isArray(query.sort) && query.sort.length === 2) {
            brands = brands.orderBy(query.sort[0], query.sort[1]);
        }
        else {
            brands = brands.orderBy("id", "DESC");
        }

        if (query.pagination === "all") {
            brands.get(function (err, result) {
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
        else {
            brands.paginate(query.pageSize, query.page, function (err, result) {
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
    }
};

module.exports = new BrandController;