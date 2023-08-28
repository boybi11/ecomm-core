class PaymentOptionsTable {

	table = "payment_options"

	up() {
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
					"name": "slug",
					"type": "varchar",
					"size": "255",
					"notNull": true,
				},
				{
					"name": "payment_name",
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
					"name": "image",
					"type": "int",
					"size": "11",
					"default": 0
				},
				{
					"name": "mid",
					"type": "text"
				},
				{
					"name": "pk",
					"type": "text"
				},
				{
					"name": "sk",
					"type": "text"
				},
				{
					"name": "sort_order",
					"type": "int"
				},
				{
					"name": "publish_date",
					"type": "datetime"
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
			],
			indexes: [
				{ "columns": [ "slug" ] }
			]
		 }
	}

	down() {
		return {
			action: "drop",
		 }
	}
}

module.exports = new PaymentOptionsTable