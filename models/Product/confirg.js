exports.fillables = {
    "name": "string",
    "sku": "string",
    "slug": "string",
    "description": "text",
    "description_draft": "text",
    "image": "int",
    "images": "text",
    "specifications": "text",
    "specifications_draft": "text",
    "price": "decimal",
    "original_price": "decimal",
    "width": "decimal",
    "length": "decimal",
    "height": "decimal",
    "track_inventory": "int",
    "category_id": "int",
    "brand_id": "int",
    "publish_date": "datetime",
    "is_featured": "int",
    "with_variant": "int",
    "parent": "int",
    "options": "string",
    "created_at": "datetime",
    "updated_at": "datetime",
    "deleted_at": "datetime",
    "selling_unit": "string",
    "variant_signature": "string"
}

exports.appends     = [ "options", "active_promo", "is_published" ]
exports.searchables = [ "name", "sku" ]
exports.tableFields = [ "products.id", "parent", "products.name", "image", "sku", "price", "original_price", "products.publish_date", "selling_unit", "track_inventory", "with_variant", "options", "slug" ]