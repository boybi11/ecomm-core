const moment = require('moment');
const GeneralHelper = require('../../../../helpers/GeneralHelper');

module.exports = ({ order, currency }) => {
    const shipping = order.fees.find(fee => fee.name.toLowerCase() === "shipping fee");
    const currencySymbol = currency ? currency.value : "PHP";

    return `
        <div class="pa-15 border-b">
            <div class="flex">
                <div class="full-w">
                    <div class="txt-sm">
                        Reference number
                    </div>
                    <div class="txt-header-2 txt-red">
                        <strong>${ order.reference_number }</strong>
                    </div>
                </div>
                <div>
                    <div class="txt-sm">
                        Total
                    </div>
                    <div class="txt-header-2 txt-red">
                        <strong>${ currencySymbol }${ GeneralHelper.numberWithCommas(order.total) }</strong>
                    </div>
                </div>
            </div>
            ${
                order.tracking_number ? (
                    `
                    <div class="txt-sm mt-10">
                        Tracking number
                    </div>
                    <div>
                        <strong>${ order.tracking_number }</strong>
                    </div>
                    `
                ) : ''
            }
            <div class="mt-20">
                Estemated to arrive on <strong>${ moment(order.delivery_start_date).format("MMM DD, YYYY") }</strong>${ order.delivery_start_date !== order.delivery_end_date ? ` to <strong>${ moment(order.delivery_end_date).format("MMM DD, YYYY") }</strong>` : '' } ${ shipping ? `via <strong class="txt-capitalize txt-red">${ shipping.type } Delivery</strong>` : '' }
            </div>
        </div>
    `;
};