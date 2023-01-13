const moment = require('moment');

module.exports = ({ order }) => `
    <div>
        <div class="txt-header-2 pa-15 border-b">
            Order Confirmation
        </div>
        <div class="pa-15 border-b">
            <div>
                Hi <strong>${ order.delivery_address.first_name } ${ order.delivery_address.last_name }</strong>,
            </div>
            <div class="mt-20">
                We received your order <strong class="txt-red">#${ order.reference_number }</strong> on <strong>${ moment(order.placed_date).format('MMMM DD, YYYY') }</strong>. We’re now processing your order and will let you know once it’s on the way. We wish you enjoy shopping with us and hope to see you again real soon!
            </div>
        </div>
    </div>
`;