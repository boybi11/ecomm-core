class ProductInventoriesTable {

	table = "product_inventories"

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
					"type": "int",
					"size": "11",
					"autoIncrement": true,
					"notNull": true,
				},
				{
					"name": "product_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "location",
					"type": "bigint",
					"default": 0
				},
				{
					"name": "quantity",
					"type": "decimal",
					"size": "10,0",
					"notNull": true,
				},
				{
					"name": "expiration_date",
					"type": "date",
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
				{
					"name": "deleted_at",
					"type": "datetime",
				},
			],
			indexes: [
				{ "columns": [ "product_id" ] },
				{ "columns": [ "location" ] },
			]
		 }
	}

	down() {
 		// write your downstream table schema here 
		 return {
			action: "drop",
		 }
	}
}

module.exports = new ProductInventoriesTable