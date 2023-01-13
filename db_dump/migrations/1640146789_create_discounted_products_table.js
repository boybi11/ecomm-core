class DiscountedProductsTable {

	table = "discounted_products"

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
					 "name":"product_id",
					  "type": "bigint",
					 "notNull": true
				 },
				 {
					"name":"product_parent_id",
					 "type": "bigint",
					 "default": '0'
				},
				{
				   "name":"ref_id",
					"type": "bigint",
				   "notNull": true
			   },
				 {
					"name":"discount_type",
					"type": "enum",
					"size": "'promotions','flash_sales','coupons'",
					"notNull": true
				 },
				 {
					"name":"amount",
				   "type": "decimal",
				   "size": "10,2",
				   "default": '0'
				 },
				 {
					"name":"amount_type",
					"type": "enum",
					"size": "'fixed','percentage'",
					"notNull": true
				 },
				 {
					"name":"publish_date",
				   "type": "datetime"
				 },
				 {
					"name":"end_date",
				   "type": "datetime"
				 }
			 ],
			 "indexes": [
				 { columns: "product_id" },
				 { columns: "publish_date" },
				 { columns: "end_date" },
				 { columns: "ref_id" },
				 { columns: "discount_type" }
			 ]
		}
	}
 
	down() {
		return { "action": "drop" }
	}
}

module.exports = new DiscountedProductsTable