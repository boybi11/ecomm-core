const User = require('../models/User')
const CustomerAddress = require('../models/CustomerAddress');

class UserHelper {
    userId = 0;
    constructor (userId) {
        this.userId = userId;
    }

    updatePrimaryAddress = async () => {
        const addresses = await new CustomerAddress()
                                            .where({ user_id: { value: this.userId } })
                                            .get()
                                            
        if (addresses && !addresses.error) {
            const user = new User()
                                .where({ id: { value: this.userId } })
                                .first()
                                
            if (user && !user.error) {
                let delivery_address_id = -1
                if (addresses && addresses.length === 1) delivery_address_id = addresses[0].id
                else if (addresses && addresses.length === 0) delivery_address_id = 0
                else if (addresses && !addresses.find(address => address.id === user.delivery_address_id)) delivery_address_id = addresses[0].id

                if (delivery_address_id > -1) {
                    await new User()
                                .where({ id: { value: this.userId } })
                                .update({ delivery_address_id }, function () {})
                }
            }
                                
        }
    }

    setPrimaryAddress = async (addressId) => {
        return await new User().where({ id: { value: this.userId } }).update({ delivery_address_id: addressId, billing_address_id: addressId })
    }
};

module.exports = UserHelper;