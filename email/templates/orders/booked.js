const GeneralHelper = require('../../../helpers/GeneralHelper');

module.exports = ({ order }) => `
    <div>
        <div class="txt-header-2 pa-15 border-b">
            Order Booked
        </div>
        <div class="pa-15 border-b">
            <div>
                Hi <strong>${ order.delivery_address.first_name } ${ order.delivery_address.last_name }</strong>,
            </div>
            <div class="mt-20">
                Your order <strong class="txt-red">#${ order.reference_number }</strong> is now booked for delivery. We are now just waiting for the courier to pickup your package and we will update you again if your order is out for delivery.
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