const OrderRefundRequest = require('../../models/OrderRefundRequest');
const AssetHelper = require('../../helpers/AssetHelper');

class OrderRefundRequestController {

    store (req, res) {
        
        AssetHelper.uploadGroup(null, req.body.attachments, (groupId) => {
            new OrderRefundRequest()
                .create({
                    ...req.body,
                    ...{
                        attachments: groupId,
                        user_id: req.authUser ? req.authUser.id : 0,
                        status: "pending"
                    }
                }, function(err, data) {
                    console.log(err)
                    if (err) res.status(400).send({ message: "Something went wrong" });
                    else res.send(data);
                });
        });
    }
}

module.exports = new OrderRefundRequestController;