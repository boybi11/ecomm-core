class OrderItemsTable {

	table = "order_items"

	// SAMPLE SCHEMA
	//{
	// "action":"create | delete | update (default)",
	// "fields":[
	//		{
	//			"name":"field_name",
	//			"rename":"new name (applicable for action update only)",
	//			"type":"varchar | int | datetime ... (database datatype)",
	//			"default":"default value",
	//			"autoIncrement":"true | false",
	//			"primary":"true | false",
	//			"notNull":"true | false",
	//			"index":"true | false",
	//			"enum":"value1, value2, value3.... (for enum type only)",
	//			"action":"create (default) | update | drop (if drop true all fields will be disregarded except for name)"
	//		}
	//	]
	//}

	up() {
		return {
			action: "update",
			fields: [{
				"name": "discount",
				"type": "decimal",
				"size": "10,2",
			}]
		}
	}

	down() {
		return {
			action: "update",
			fields: [
				{
					"name": "discount",
					"action": "drop"
				}
			]
		}
	}
}

module.exports = new OrderItemsTable