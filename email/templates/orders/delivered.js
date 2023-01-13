const GeneralHelper = require('../../../helpers/GeneralHelper');

module.exports = ({ order, currency }) => `
    <div>
        <div class="txt-header-2 pa-15 border-b">
            Order Delivered
        </div>
        <div class="pa-15 border-b">
            <div>
                Hi <strong>${ order.delivery_address.first_name } ${ order.delivery_address.last_name }</strong>,
            </div>
            <div class="mt-20">
                Your order <strong class="txt-red">#${ order.reference_number }</strong> has been successfully delivered. Thank you for shopping with us!
            </div>
            <div class="mt-20 txt-center">
                <div>Tracking Number</div>
                <div class="txt-header-2">
                    <strong>${ order.tracking_number }</strong>
                </div>
            </div>
        </div>
    </div>
`;