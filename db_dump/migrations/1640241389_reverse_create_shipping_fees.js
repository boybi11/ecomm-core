class ShippingFeesTable {

	table = "shipping_fees"

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
 		// write your upstream table schema here 
		 return {
			action: "create",
			fields: [
				{
					"name": "id",
					"type": "bigint",
					"size": "20",
					"autoIncrement": true,
					"notNull": true,
				},
				{
					"name": "is_enabled",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "name",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "basis",
					"type": "enum",
					"size": "'weight','price'",
					"default": "weight",
					"notNull": true,
				},
				{
					"name": "free_shipping_threshold",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "created_at",
					"type": "datetime",
					"notNull": true,
				},
				{
					"name": "updated_at",
					"type": "datetime",
				},
			],
		 }
	}

	down() {
 		// write your downstream table schema here 
		 return {
			action: "drop",
		 }
	}
}

module.exports = new ShippingFeesTable