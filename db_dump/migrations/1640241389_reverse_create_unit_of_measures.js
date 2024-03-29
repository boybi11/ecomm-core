class UnitOfMeasuresTable {

	table = "unit_of_measures"

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
					"name": "name",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "unit",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "ratio",
					"type": "int",
					"size": "11",
					"notNull": true,
				},
				{
					"name": "ratio_eq",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "length",
					"type": "decimal",
					"size": "10,2",
				},
				{
					"name": "height",
					"type": "decimal",
					"size": "10,2",
				},
				{
					"name": "width",
					"type": "decimal",
					"size": "10,2",
				},
				{
					"name": "original_price",
					"type": "decimal",
					"size": "10,2",
					"default": 0
				},
				{
					"name": "price",
					"type": "decimal",
					"size": "10,2",
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

module.exports = new UnitOfMeasuresTable