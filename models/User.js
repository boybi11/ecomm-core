const Base = require('../core/BaseModelV2')
class User extends Base {
    constructor(connection) {
        super(connection)
        this.table      = "users"
        this.searchables = [
                            "first_name",
                            "last_name",
                            "email"
                        ]
        this.fillables  = {
                            "username": "string",
                            "password": "string",
                            "first_name": "string",
                            "last_name": "string",
                            "phone": "string",
                            "gender": "string",
                            "birthday": "date",
                            "email": "string",
                            "cms": "int",
                            "image": "int",
                            "is_activated": "int",
                            "role": "string",
                            "token": "text",
                            "slug": "text",
                            "created_at": "datetime",
                            "updated_at": "datetime",
                            "deleted_at": "datetime",
                            "last_login": "datetime",
                            "last_activity": "datetime",
                            "is_permanent": "int",
                            "delivery_address_id": "int",
                            "billing_address_id": "int"
                        }

        this.protected = ["password"]
    }

    asset       = () => this.hasOne('Asset', 'id', 'image')

    addresses   = () => this.hasMany("CustomerAddress", "user_id", "id")

    primaryAddress = () => this.hasOne("CustomerAddress", "id", "delivery_address")

    lastOrder   = () => this.hasOne("Order", "user_id", "id", { forTable: {}, orderBy: ["id", "desc"], where: { status: { value: "cart", operation: "!=" } } })

    roleAccess  = () => this.hasOne("AdminRole", "id", "role")
}

module.exports = User