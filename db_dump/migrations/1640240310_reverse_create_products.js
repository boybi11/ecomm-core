class ProductsTable {

	table = "products"

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
					"name": "name",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "slug",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "sku",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "description",
					"type": "text",
				},
				{
					"name": "description_draft",
					"type": "text",
				},
				{
					"name": "specifications",
					"type": "text",
				},
				{
					"name": "specifications_draft",
					"type": "text",
				},
				{
					"name": "image",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "images",
					"type": "text"
				},
				{
					"name": "publish_date",
					"type": "datetime",
				},
				{
					"name": "price",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "original_price",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "width",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "height",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "length",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
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
					"name": "track_inventory",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "is_featured",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "category_id",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "brand_id",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "with_variant",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "parent",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "options",
					"type": "varchar",
					"size": "255",
				},
				{
					"name": "selling_unit",
					"type": "varchar",
					"size": "255",
				},
			],
			indexes: [
				{ "columns": [ "name" ] },
				{ "columns": [ "slug" ] },
				{ "columns": [ "sku" ] },
				{ "columns": [ "publish_date" ] },
				{ "columns": [ "price" ] },
				{ "columns": [ "category_id" ] },
				{ "columns": ["brand_id" ] },
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

module.exports = new ProductsTable