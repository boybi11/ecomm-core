class OrdersTable {

	table = "orders"

	up() {
		return {
			action: "update",
			fields: [
				{
					"name": "token",
					"type": "text"
				}
			]
		}
	}

	down() {
		return {
			action: "update",
			fields: [
				{
					"name": "token",
					"action": "drop"
				}
			]
		}
	}
}

module.exports = new OrdersTable