class InventoryHistoriesTable {

	table = "inventory_histories"

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
					"name": "product_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "quantity",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "action",
					"type": "varchar",
					"size": "255",
					"default": "restock",
					"notNull": true,
				},
				{
					"name": "location",
					"type": "bigint"
				},
				{
					"name": "message",
					"type": "text",
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

module.exports = new InventoryHistoriesTable