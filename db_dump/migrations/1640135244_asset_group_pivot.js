class AssetGroupPivotTable {

	table = "asset_group_pivots"

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
					"name":"asset_id",
					"type":"tinyint"
				},
				{
					"name":"asset_group_id",
					"type":"tinyint"
				},
				{
					"name": "created_at",
					"type": "datetime",
					"notNull": true
				}
			],
			indexes: [
				{ columns: "asset_id" },
				{ columns: "asset_group_id" },
			]
	   }
   }

   down() {
	   return { "action": "drop" }
   }
}

module.exports = new AssetGroupPivotTable