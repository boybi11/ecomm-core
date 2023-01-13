class ActivitiesTable {

	table = "activities"

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
						"name": "user_id",
						"type": "bigint",
						"notNull": true
					},
					{
						"name": "ref_id",
						"type": "bigint",
						"notNull": true
					},
					{
						"name": "model",
						"notNull": true
					},
					{
						"name": "type",
						"size": 100,
						"notNull": true
					},
					{
						"name": "encoded_data",
						"type": "longtext"
					},
					{
						"name": "encoded_prev_data",
						"type": "longtext"
					},
					{
						"name": "message",
						"type": "longtext"
					},
					{
						"name": "created_at",
						"type": "datetime",
						"notNull": true
					}
				],
			"indexes": [
				{ columns: "user_id" },
				{ columns: "ref_id" },
				{ columns: "model" },
				{ columns: "type" }
			]
		}
	}

	down() {
		return { "action": "drop" }
	}
}

module.exports = new ActivitiesTable