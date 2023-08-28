const moment = require('moment');

module.exports = ({ data }) => `
    <div>
        <div class="txt-header-2 pa-15 border-b">
            Order Confirmation
        </div>
        <div class="pa-15 border-b">
            <div>
                Hi <strong>${ data.address.first_name } ${ data.address.last_name }</strong>,
            </div>
            <div class="mt-20">
                We received your order <strong class="txt-red">#${ data.order.reference_number }</strong> on <strong>${ moment(data.order.placed_date).format('MMMM DD, YYYY') }</strong>. We’re now processing your order and will let you know once it’s on the way. We wish you enjoy shopping with us and hope to see you again real soon!
            </div>
        </div>
    </div>
`;