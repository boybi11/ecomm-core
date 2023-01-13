class BrandsTable {

	table = "brands"

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
					"name":"name",
					"notNull": true
				},
				{
					"name":"slug",
					"notNull": true
				},
				{
					"name":"description",
					"type":"longtext"
				},
				{
					"name": "description_draft",
					"type":"longtext"
				},
				{
					"name": "is_featured",
					"type": "tinyint"
				},
				{
					"name": "image",
					"type": "bigint"
				},
				{
					"name": "publish_date",
					"type": "datetime"
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
			"indexes": [
				{ columns: "slug" }
			]
	   }
   }

   down() {
	   return { "action": "drop" }
   }
}

module.exports = new BrandsTable