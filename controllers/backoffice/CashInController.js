// models
const CashIn = require('../../models/CashIn');
const moment = require('moment');

class CashInController {

    get(req, res) {
        const currentDate = moment();
        const { query } = req;
        if (!query.year) query.year = currentDate.format("YYYY");

        new CashIn()
            .where({ year: {value: query.year} })
            .get(function (err, data) {
                if (err) res.status(400).send({ message: "Something went wrong!" });
                else {
                    if (data.length) res.send(data);
                    else initializeCashIn(query.year, (cbData) => res.send(cbData))
                }
            });
    }

    update(req, res) {
        new CashIn()
            .where({id: { value: req.params.id } })
            .update({ status: req.body.status }, function (err, data) {
                if (err) res.status(400).send({ message: "Something went wrong!" });
                else res.send({message: "Update Successful!"});
            });
    }
}

const initializeCashIn = (year, cb) => {
    let cashIns = [];

    [...Array(12)].forEach((v, i) => {
        const month = i + 1;
        const cashIn = {
            month: `${month < 10 ? '0' : ''}${month}`,
            year,
            status: "unpaid"
        }

        cashIns.push(cashIn);
    });

    new CashIn()
        .create(cashIns, function(err, data) {
            const ids = [...Array(12)].map((v, i) => data.insertId + i);

            new CashIn()
                .whereIn({id: ids})
                .get(function(gErr, gData) {
                    cb(gData ? gData : []);
                });
        })
}

module.exports = new CashInController;