class AssetsTable {

	table = "assets"

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
		   "action":"create",
		   "fields":[
				{
					"name":"id",
					"type":"bigint",
					"autoIncrement": true
				},
				{
					"name": "asset_group_id",
					"type": "bigint",
					"default": 0
				},
				{ "name": "name" },
				{
					"name": "path",
					"type": "text",
					"notNull": true
				},
				{
					"name": "m_thumbnail",
					"type": "text"
				},
				{
					"name": "s_thumbnail",
					"type": "text"
				},
				{ "name": "caption "},
				{ "name": "alt" },
				{ "name": "type" },
				{
					"name": "size",
					"type": "bigint"
				},
				{
					"name": "is_temp",
					"type": "tinyint",
					"default": 1,
					"notNull": true
				},
				{
					"name": "created_at",
					"type": "datetime",
					"notNull": true
				},
				{
					"name": "updated_at",
					"type": "datetime"
				}
			],
			indexes: [
				{ columns: "asset_group_id" }
			]
	   }
   }

   down() {
	   return { "action": "drop" }
   }
}

module.exports = new AssetsTable