class CancelledItemsTable {

	table = "cancelled_items"

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
					"name":"order_id",
					"notNull": true,
					"type": "bigint"
				},
				{
					"name":"product_parent_id",
					"notNull": true,
					"type": "bigint"
				},
				{
					"name":"product_id",
					"notNull": true,
					"type": "bigint"
				},
				{
					"name": "quantity",
					"type": "decimal",
					"notNull": true,
					"size": "10,2",
				},
				{
					"name": "restock_quantity",
					"type": "decimal",
					"size": "10,2"
				},
				{
					"name": "price",
					"type": "decimal",
					"notNull": true,
					"size": "10,2"
				},
				{
					"name": "original_price",
					"type": "decimal",
					"size": "10,2"
				},
				{
					"name": "refund_amount",
					"type": "decimal",
					"size": "10,2"
				},
				{ "name": "selling_unit" },
				{
					"name": "uom_ratio",
					"type": "int",
					"default": 1
				},
				{
					"name": "coupon_id",
					"type": "bigint"
				},
				{
					"name": "promotion_id",
					"type": "bigint"
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
				{ columns: "order_id" },
				{ columns: "product_id" },
				{ columns: "product_parent_id" },
				{ columns: "coupon_id" },
				{ columns: "promotion_id" }
			]
	   }
   }

   down() {
	   return { "action": "drop" }
   }
}

module.exports = new CancelledItemsTable