class CustomerAddressesTable {

	table = "customer_addresses"

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
					 "name":"user_id",
					  "type": "bigint",
					 "notNull": true
				 },
				 {
					"name":"first_name",
				   "notNull": true
				 },
				 {
					"name":"last_name",
				   "notNull": true
				 },
				 {
					"name":"email",
				   "notNull": true
				 },
				 {
					"name":"address_line",
				   "notNull": true
				 },
				 {
					"name":"country_id",
					"type": "int",
				   "notNull": true
				 },
				 {
					"name":"province_id",
					"type": "int",
				   "notNull": true
				 },
				 {
					"name":"city_id",
					"type": "int",
				   "notNull": true
				 },
				 {
					"name":"area_id",
					"type": "int",
				   "notNull": true
				 },
				 {
					"name":"zip",
				   "notNull": true
				 },
				 {
					"name":"mobile_number",
				   "notNull": true
				 },
				 {
					"name":"label"
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
				 { columns: "user_id" },
				 { columns: "email" },
				 { columns: "mobile_number" }
			 ]
		}
	}
 
	down() {
		return { "action": "drop" }
	}
}

module.exports = new CustomerAddressesTable