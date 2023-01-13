class CouponsTable {

	table = "coupons"

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
					 "name":"code",
					 "notNull": true
				 },
				 {
					 "name":"coupon_type",
					 "notNull": true
				 },
				 {
					 "name":"usage_limit",
					 "type":"int"
				 },
				 {
					 "name": "start_date",
					 "type":"date"
				 },
				 {
					"name": "end_date",
					"type":"date"
				},
				 {
					 "name": "value	",
					 "type": "decimal",
					 "size": "10,2",
					 "notNull": true
				 },
				 {
					"name": "value_type",
					"type": "enum",
					"size": "'fixed','percent'",
					"default": "'fixed'"
				},
				{
					"name": "min_spend",
					"type": "decimal",
					"size": "10,2",
					"default": 0
				},
				 {
					 "name": "shipping_discount",
					 "type": "decimal",
					"size": "10,2",
					"default": 0
				 },
				 {
					 "name": "apply_to",
					 "type": "enum",
					 "size": "'selected','all'",
					 "default": "'selected'"
				 },
				 {
					 "name": "created_at",
					 "type": "datetime",
					 "notNull": true
				 },
				 {
					 "name": "updated_at",
					 "type": "datetime"
				 },
				 {
					 "name": "deleted_at",
					 "type": "datetime"
				 }
			 ],
			 "indexes": [
				 { columns: "code" },
				 { columns: "coupon_type" }
			 ]
		}
	}
 
	down() {
		return { "action": "drop" }
	}
}

module.exports = new CouponsTable