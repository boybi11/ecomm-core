const settings = require('../../../config');
const orderMessages = {
    confirmation: require('./confirmation'),
    booked: require('./booked'),
    "in transit": require('./intransit'),
    delivered: require('./delivered')
};
const {
    OrderItems,
    OrderDetails,
    AddressDetails,
    OrderBilling
} = require('./utils');

module.exports = ({ data, type = "confirmation", siteDetails }) => {
    const { base, site } = settings.URL;
    const currency = siteDetails.find(setting => setting.slug === "currency-symbol") || "PHP";

    return `
        <div>
            <div class="border-a border-r">
                ${ orderMessages[type]({ data, currency }) }
                ${ OrderDetails({ data, currency }) }
                <div class="pa-15 border-b" style="background: #e34040;">
                    <div class="border-a border-r bg-white">
                        ${ AddressDetails({ address: data.address, baseUrl: base }) }
                    </div>
                    <div class="border-a border-r mt-20 bg-white">
                        ${ AddressDetails({ address: data.address, baseUrl: base }) }
                    </div>
                    <div class="border-a border-r mt-20 bg-white">
                        ${ OrderItems({ items: data.items , baseUrl: base, siteUrl: site, currency }) }
                    </div>
                </div>
                ${ OrderBilling({ data, currency }) }
            </div>
        </div>
    `;
}