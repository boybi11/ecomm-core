class InquiriesTable {

	table = "inquiries"

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
					"name": "message",
					"type": "text",
					"notNull": true,
				},
				{
					"name": "topic",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "created_at",
					"type": "datetime",
					"notNull": true,
				},
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

module.exports = new InquiriesTable