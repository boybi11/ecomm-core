class OrderFeesTable {

	table = "order_fees"

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
					"name": "order_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "name",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "amount",
					"type": "decimal",
					"size": "10,2",
					"notNull": true,
				},
				{
					"name": "type",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "json_data",
					"type": "text",
				},
			],
			indexes: [
				{ "columns": [ "order_id" ] },
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

module.exports = new OrderFeesTable