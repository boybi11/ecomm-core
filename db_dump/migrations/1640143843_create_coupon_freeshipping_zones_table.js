class CouponFreeshippingZonesTable {

	table = "coupon_freeshipping_zones"

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
					 "name":"coupon_id",
					  "type": "bigint",
					 "notNull": true
				 },
				 {
					"name":"province_id",
					"type": "int",
				   "notNull": true
				 }
			 ],
			 "indexes": [
				 { columns: "province_id" },
				 { columns: "coupon_id" }
			 ]
		}
	}
 
	down() {
		return { "action": "drop" }
	}
}

module.exports = new CouponFreeshippingZonesTable