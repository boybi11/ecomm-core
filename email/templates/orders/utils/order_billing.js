const GeneralHelper = require('../../../../helpers/GeneralHelper');

module.exports = ({ order, currency }) => {
    const currencySymbol = currency ? currency.value : "PHP";
    return `
        <div class="pa-30">
            <table class="full-w">
                <tr>
                    <td>
                        <strong>Payment</strong>
                    </td>
                    <td class="txt-right">
                        ${ order.payment_method.replace(/-/g, ' ').toUpperCase() }
                    </td>
                </tr>
                <tr>
                    <td>
                        <strong>Subtotal</strong>
                    </td>
                    <td class="txt-right">
                    ${ currencySymbol }${ GeneralHelper.numberWithCommas(order.subtotal) }
                    </td>
                </tr>
                ${
                    order.fees.map(fee => `
                        <tr>
                            <td>
                                <strong>${ fee.name }</strong>${ fee.type ? `(${ fee.type })` : ''}
                            </td>
                            <td class="txt-right">
                                ${ currencySymbol }${ GeneralHelper.numberWithCommas(fee.amount) }
                            </td>
                        </tr>
                    `)
                }
                <tr>
                    <td>
                        <strong>Discount</strong>
                    </td>
                    <td class="txt-red txt-right">
                        ${ currencySymbol }${ GeneralHelper.numberWithCommas(order.discount_amount) }
                    </td>
                </tr>
                <tr>
                    <td>
                        <strong>Total</strong>
                    </td>
                    <td class="txt-right">
                        <strong>
                            ${ currencySymbol }${ GeneralHelper.numberWithCommas(order.total) }
                        </strong>
                    </td>
                </tr>
            </table>
        </div>
    `;
};