class UsersTableSeed {

	table = "users"

	exec() {
 		// write your seeder schema here 
		return {
			columns: ["id","username","password","email","first_name","last_name","phone","image","gender","birthday","cms","role","is_activated","token","created_at","updated_at","deleted_at","last_login","last_activity","is_permanent","slug","delivery_address_id","billing_address_id"],
			values: [
				["1","admin.biboy","password123","boybi.oyales@gmail.com","Biboy","Oyales","4085553739","8","male","1989-10-11 00:00:00","1","null","0","WNpOmIyl5sgiG3jcxnmB11dpS4JhlTDQ6m92aC8QgiMCEdt7K9kE3JJ8c3gekCPSx9xmNAjERxM","null","2021-12-09 18:56:09","null","2021-12-09 18:56:05","2021-12-09 18:56:09","1","biboy-oyales-boybioyalesgmailcom","7","0"],
			]
		}
	}
}

module.exports = new UsersTableSeed