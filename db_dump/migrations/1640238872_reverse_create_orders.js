class OrdersTable {

	table = "orders"

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
					"name": "user_id",
					"type": "bigint",
					"size": "20",
					"default": 0,
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
					"name": "source",
					"type": "enum",
					"size": "'store','direct'",
					"notNull": true,
				},
				{
					"name": "reference_number",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "checkout_reference",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "tracking_number",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "courier",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "status",
					"type": "enum",
					"size": "'cart','checkout','placed','processing','fulfilled','booked','in transit','delivered','picked up','received','cancelled','refunded'",
					"notNull": true,
				},
				{
					"name": "is_paid",
					"type": "tinyint",
					"size": "4",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "payment_method",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "subtotal",
					"type": "decimal",
					"size": "10,2",
					"notNull": true,
				},
				{
					"name": "total",
					"type": "decimal",
					"size": "10,2",
					"notNull": true,
				},
				{
					"name": "payment_amount",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "discount_amount",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
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
					"name": "remarks",
					"type": "text",
				},
				{
					"name": "special_instructions",
					"type": "text",
				},
				{
					"name": "delivery_start_date",
					"type": "datetime",
				},
				{
					"name": "delivery_end_date",
					"type": "datetime",
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
				{
					"name": "status_updated_at",
					"type": "datetime",
				},
				{
					"name": "seen_at",
					"type": "datetime",
				},
				{
					"name": "paid_at",
					"type": "datetime",
				},
			],
			indexes: [
				{ "columns": [ "user_id" ] },
				{ "columns": [ "reference_number" ] },
				{ "columns": [ "status" ] },
				{ "columns": [ "is_paid" ] },
				{ "columns": [ "payment_method" ] }
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

module.exports = new OrdersTable