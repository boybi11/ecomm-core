exports.fillables = {
    "source": "string",
    "user_id": "int",
    "coupon_id": "int",
    "reference_number": "string",
    "checkout_reference": "string",
    "tracking_number": "string",
    "is_paid": "int",
    "payment_method": "string",
    "status": "string",
    "subtotal": "decimal",
    "total": "decimal",
    "payment_amount": "decimal",
    "discount_amount": "decimal",
    "refunded_amount": "decimal",
    "remarks": "string",
    "special_instructions": "string",
    "delivery_start_date": "datetime",
    "delivery_end_date": "datetime",
    "created_at": "datetime",
    "updated_at": "datetime",
    "status_updated_at": "datetime",
    "deleted_at": "datetime",
    "seen_at": "datetime",
    "paid_at": "datetime",
    "is_first": "int",
    "token": "string",
    "full_address": "string"
}

exports.appends     = ["status_date", "refund_request"]
exports.searchables = [ "reference_number" ]