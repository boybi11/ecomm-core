class PageControlsTable {

	table = "page_controls"

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
					"name": "page_content_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "field_name",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "label",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "slug",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "predefined_value",
					"type": "longtext",
				},
				{
					"name": "type",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "is_required",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "is_displayed",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "order_index",
					"type": "int",
					"size": "11",
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
			indexes: [
				{ "columns": [ "page_content_id" ] },
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

module.exports = new PageControlsTable