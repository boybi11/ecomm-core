class OrderItemsTable {

	table = "order_items"

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
					"name": "product_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "product_parent_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "order_id",
					"type": "bigint",
					"size": "20",
					"notNull": true,
				},
				{
					"name": "coupon_id",
					"type": "bigint",
					"size": "20",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "promotion_id",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "original_price",
					"type": "decimal",
					"size": "10,2",
					"notNull": true,
				},
				{
					"name": "price",
					"type": "decimal",
					"size": "10,2",
					"notNull": true,
				},
				{
					"name": "quantity",
					"type": "decimal",
					"size": "10,2",
					"notNull": true,
				},
				{
					"name": "selling_unit",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "uom_ratio",
					"type": "int",
					"size": "11",
					"default": 1,
					"notNull": true,
				},
				{
					"name": "refunded_amount",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "status",
					"type": "enum",
					"size": "'cart','processing','fulfilled','in-transit','delivered','received'",
					"default": "cart",
					"notNull": true,
				},
				{
					"name": "is_prepared",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "created_at",
					"type": "datetime",
					"notNull": true,
				},
				{
					"name": "updated_at",
					"type": "datetime",
				},
				{
					"name": "deleted_at",
					"type": "datetime",
				},
			],
			indexes: [
				{ "columns": [ "product_id" ] },
				{ "columns": [ "coupon_id" ] },
				{ "columns": [ "promotion_id" ] },
				{ "columns": [ "order_id" ] },
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

module.exports = new OrderItemsTable