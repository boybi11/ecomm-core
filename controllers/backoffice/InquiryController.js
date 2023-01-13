const Inquiry = require('../../models/Inquiry');

class InquiryController {

    get(req, res) {
        let inquiries = new Inquiry();
                            
        const {query} = req;

        if (query.filters) {
            const filters = JSON.parse(query.filters);
            Object.keys(filters).map(key => {
                filters[key] = {
                    value: `${filters[key]}%`,
                    operation: " LIKE "
                };
            });
            
            inquiries = inquiries.where(filters);
        }

        if (query.sort && Array.isArray(query.sort) && query.sort.length === 2) {
            inquiries = inquiries.orderBy(query.sort[0], query.sort[1]);
        } else {
            inquiries = inquiries.orderBy("id", "DESC");
        }

        inquiries.paginate(query.pageSize, query.page, function (err, result) {
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

    store(req, res) {
        new Inquiry()
            .create(req.body, function (err, result) {
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

    edit (req, res) {
        if (!req.query.id) {
            res.status(204).send("Missing id request parameter");
        }

        new Inquiry()
            .where({"id": {value: req.query.id}})
            .first(function(err, result) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    if (result) {
                        res.send(result);
                    } else {
                        res.status(400).send({});
                    }
                }
            });
    }

    update(req, res) {
        if (req.params.id) {
            new Inquiry()
                .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                .update(Object.assign({}, req.body), function (err, result) {
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
        } else {
            res.status(400).send("Id request parameter is required.");
        }
    }

    delete(req, res) {
        const ids = req.body && req.body.ids;

        if (ids && Array.isArray(ids) && ids.length > 0) {
            new Inquiry()
                .delete(ids, function(err, result) {
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

module.exports = new InquiryController;