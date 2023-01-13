class CategoriesTable {

	table = "categories"

	up() {
		return {
			action: "update",
			fields: [
				{ "name": "path" }
			]
		}
	}

	down() {
		return {
			action: "update",
			fields: [
				{
					"name": "path",
					"action": "drop"
				}
			]
		}
	}
}

module.exports = new CategoriesTable