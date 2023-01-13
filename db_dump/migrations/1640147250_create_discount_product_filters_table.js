class DiscountProductFiltersTable {

	table = "discount_product_filters"

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
					 "name":"ref_id",
					  "type": "bigint",
					 "notNull": true
				 },
				 {
					"name":"ref_type",
					"notNull": true
				 },
				 {
					"name":"filter_type",
					"notNull": true
				 },
				 {
					 "name": "value",
					 "type": "int",
					 "notNull": true
				 },
				 {
					"name":"created_at",
				   "type": "datetime",
				   "notNull": true
				 },
				 {
					"name":"update_at",
				   "type": "datetime"
				 }
			 ],
			 "indexes": [
				 { columns: "ref_id" },
				 { columns: "ref_type" },
				 { columns: "filter_type" }
			 ]
		}
	}
 
	down() {
		return { "action": "drop" }
	}
}

module.exports = new DiscountProductFiltersTable