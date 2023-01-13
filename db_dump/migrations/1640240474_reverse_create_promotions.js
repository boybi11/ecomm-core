class PromotionsTable {

	table = "promotions"

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
					"type": "int",
					"size": "11",
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
					"name": "description",
					"type": "text",
				},
				{
					"name": "description_draft",
					"type": "text",
				},
				{
					"name": "publish_date",
					"type": "datetime",
				},
				{
					"name": "end_date",
					"type": "datetime",
				},
				{
					"name": "image",
					"type": "int",
					"size": "11",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "type",
					"type": "enum",
					"size": "'promotion','flash'",
					"notNull": true,
				},
				{
					"name": "apply_to",
					"type": "enum",
					"size": "'all','selected'",
					"default": "selected",
					"notNull": true,
				},
				{
					"name": "discount_all",
					"type": "decimal",
					"size": "10,2",
					"default": 0,
					"notNull": true,
				},
				{
					"name": "amount_type",
					"type": "enum",
					"size": "'fixed','percentage'",
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
				{ "columns": [ "name","slug","publish_date" ] },
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

module.exports = new PromotionsTable