class UsersTable {

	table = "users"

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
					"name": "username",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "password",
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
					"name": "phone",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "image",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "gender",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "birthday",
					"type": "date",
				},
				{
					"name": "cms",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "role",
					"type": "int",
					"size": "11",
				},
				{
					"name": "is_activated",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "token",
					"type": "text",
				},
				{
					"name": "created_at",
					"type": "datetime",
				},
				{
					"name": "updated_at",
					"type": "datetime",
				},
				{
					"name": "deleted_at",
					"type": "datetime",
				},
				{
					"name": "last_login",
					"type": "datetime",
				},
				{
					"name": "last_activity",
					"type": "datetime",
				},
				{
					"name": "is_permanent",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "slug",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "delivery_address_id",
					"type": "int",
					"size": "11",
				},
				{
					"name": "billing_address_id",
					"type": "int",
					"size": "11",
				},
			],
		 }
	}

	down() {
 		// write your downstream table schema here 
		 return {
			action: "drop",
		 }
	}
}

module.exports = new UsersTable