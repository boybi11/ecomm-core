class OrderAddressesTable {

	table = "order_addresses"

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
					"name": "first_name",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "last_name",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "email",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "address_line",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "country_id",
					"type": "int",
					"size": "11",
					"default": 1,
					"notNull": true,
				},
				{
					"name": "province_id",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "city_id",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "area_id",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "zip",
					"type": "varchar",
					"size": "10",
				},
				{
					"name": "mobile_number",
					"type": "varchar",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "type",
					"type": "enum",
					"size": "'delivery','billing','pickup'",
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
			indexes: [
				{ "columns": [ "order_id" ] },
				{ "columns": [ "mobile_number" ] },
				{ "columns": [ "email" ] }
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

module.exports = new OrderAddressesTable