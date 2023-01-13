const GeneralHelper = require('../../../../helpers/GeneralHelper');

module.exports = ({ items, baseUrl, siteUrl, currency }) => {
    let totalItems = 0;
    items.forEach(item => (totalItems += item.quantity));

    return `
        <div>
            <div class="border-b pa-15">
                <table class="full-w">
                    <tr>
                        <td>
                            <img src="${ baseUrl }/assets/img/icons/box.png" class="icon mr-10" />
                        </td>
                        <td>
                            <strong>Items</strong>
                        </td>
                        <td class="full-w txt-right">
                            ${ totalItems } item${ totalItems > 1 ? 's' : '' }
                        </td>
                    </tr>
                </table>
            </div>
            ${
                items.map((item, index) => `
                    <div class="pa-15 flex ${index === items.length - 1 ? '' : 'border-b'}">
                        <div class="mr-10">
                            <img
                                src="${ baseUrl }${ item.product.asset ? item.product.asset.path : '' }"
                                class="product-img"
                            />
                        </div>
                        <div class="full-w">
                            <div>
                                <strong>
                                    <a href="${ siteUrl }/product/${ item.product.slug }" target="_blank" style="color: black">
                                        ${ item.product.name }
                                    </a>
                                </strong>
                            </div>
                            ${
                                item.product.options && item.product.options.length ? (
                                    `<div style="margin-bottom: 10px">
                                        ${
                                            item.product.options.map(option => (
                                                `<div style="display: inline-block; background: #666; color: #fff; font-size: 12px;" class="border-r pa">
                                                    ${option.group}: ${option.value}
                                                </div>`
                                            ))
                                        }
                                    </div>`
                                ) : ''
                            }
                            <div>
                                ${ currency ? currency.value : '₱' }${ GeneralHelper.numberWithCommas(item.price) } ${ item.selling_unit ? `/ ${ item.selling_unit }` : '' }
                            </div>
                            <div>
                                Quantity: ${ item.quantity } ${ item.selling_unit ? item.selling_unit : '' }
                            </div>
                        </div>
                        <div>
                            <strong>
                                ${ currency ? currency.value : '₱' }${ GeneralHelper.numberWithCommas(item.price * item.quantity) }
                            </strong>
                        </div>
                    </div>
                `)
                .join('<>')
                .replace(/<>/g, '')
            }
        </div>
    `;
};