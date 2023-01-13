class NotificationsTable {

	table = "notifications"

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
					"name": "ref_target",
					"notNull": true
				},
				{
					"name": "message",
					"type": "longtext",
					"notNull": true,
				},
				{
					"name": "hyperlink",
					"type": "text",
				},
				{
					"name": "created_at",
					"type": "datetime",
					"notNull": true,
				},
				{
					"name": "seen_at",
					"type": "datetime",
				},
				{
					"name": "read_at",
					"type": "datetime",
				},
			],
			indexes: [
				{ "columns": [ "ref_target" ] },
				{ "columns": [ "ref_target", "seen_at" ] },
				{ "columns": [ "ref_target", "read_at" ] },
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

module.exports = new NotificationsTable