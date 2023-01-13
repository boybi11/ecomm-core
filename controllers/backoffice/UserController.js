const moment            = require('moment')
const User              = require('../../models/User')
const CustomerAddress   = require('../../models/CustomerAddress')

const BaseController    = require('../../core/BaseController')
const GeneralHelper     = require('../../helpers/GeneralHelper')
const UserHelper        = require('../../helpers/UserHelper')
const EncHelper         = require('../../helpers/EncHelper')

class UserController extends BaseController {
    
    auth = async (req, response) => {
        const {
            username,
            password,
            cms
        }               = req.body.creds
        let result    = await new User()
                            .with(["asset", "roleAccess"])
                            .whereRaw(`(username='${ username }' OR email='${ username }')`)
                            .where({
                                "password": { value: password },
                                "cms": { value: cms || 1 }
                            })
                            .first()
                                    
        if (result) {
            if (result.error) this.response(result, response)
            else {
                const timeStamp = moment().format()
                const userAgent = req.get("user-agent")
                //generate JWT
                const jwt       = {
                                    id: result.id,
                                    cms: result.cms,
                                    last_activity: timeStamp,
                                    ip: req.ip,
                                    userAgent
                                }
                result.token    = EncHelper.encrypt(jwt)

                const update    = await new User()
                                            .log(result, result.id, result.id)
                                            .where({id: {value: result.id}})
                                            .update({token: result.token, last_login: timeStamp, last_activity: timeStamp })

                if (update && update.loggable) {
                    update.loggable.type = "login"
                    this.log(update)

                    result = { ...result, ...update.data }
                }
                
                this.response(result, response)
            }
        }
        else response.status(400).send({message: "Invalid username or password."})
    }

    get = async (req, response) => {
        const { query } = req
        let users       = new User()
                            .join("admin_roles", "admin_roles.id = users.role", "LEFT")
                            .select(["users.*", "admin_roles.name as role_title"])
                            .with(['asset', "addresses"])
                            .where(req.params.type === "all" || req.params.type === "customers" ? {} : { cms: { value: 1 } })

        if (query.access === "inventory") {
            users = users
                        .select(["modules"])
                        .whereRaw('JSON_EXTRACT(modules, "$.inventories") IS NOT NULL')
        }
        if (req.authUser.role && req.params.type !== "customers") users = users.whereRaw("role IS NOT NULL")

        this.filter(users, query)
        this.sort(users, query.sort)
        
        let result

        if (query.list) result = await users.get()
        else result = await users.paginate(query.pageSize, query.page)

        this.response(result, response)
    }

    store = async (req, response) => {
        const token =       GeneralHelper.randomStr(75)
        const password =    GeneralHelper.randomStr(15)
        const slug =        req.body.first_name + moment().unix()
        const cms =         req.params.type === "customers" ? 0 : 1
        const data =        { ...req.body, token, password, slug, cms }

        const result = await new User()
                                    .log(data, req.authUser.id)
                                    .create(data)

        this.response(result, response)
    }

    edit = async (req, response) => {
        if (!req.params.id) res.status(204).send({ message: "Missing request parameter" })

        const result = await new User()
                                    .with(['asset', 'roleAccess', ...( req.params.type === "admin" ? [] : ["addresses"]) ])
                                    .where({"id": {value: req.params.id}})
                                    .first()

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params && req.params.id) {
            const data = Object.assign({}, req.body)
            if (!data.slug) data.slug = GeneralHelper.slugify(`${ data.first_name } ${ data.last_name } ${ data.email }`)
            
            const update = await new User()
                                        .log(data, req.authUser.id, req.params.id)
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update(data)
            if (update && !update.error) {
                const user = await new User()
                                        .with('asset')
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .first()

                this.response(user, response)
            }
            else this.response(update, response, false)
        }
        else this.sendError("Missing request parameter", response)
    }

    delete = async (req, response) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {
            const result = await new User()
                                        .log({}, req.authUser.id)
                                        .delete(ids)

            this.response(result, response)
        }
        else this.sendError("Missing request parameter", response)
    }

    setPrimaryAddress = async (req, response) => {
        if (req.params.addressId) {
            const address = await new CustomerAddress()
                                        .where({ id: { value: req.params.addressId } })
                                        .first()

            if (address && !address.error) {
                const result = await new UserHelper(address.user_id).setPrimaryAddress(address.id)
                this.response(result, response)
            }
            else this.response(address, response)
        }   
        else this.sendError("Missing request parameter.", response)
    }
    // CUSTOM REQUEST
    // resetPassword(req, res) {
    //     new User()
    //         .where({email: {value: req.body.email}})
    //         .first((fErr, fRes) => {
    //             if (fErr) {
    //                 res.status(400).send(fErr)
    //             } else {
    //                 if (fRes) {
    //                     const newPass = GeneralHelper.randomStr(15)
    //                     new User()
    //                         .where({id: {value: fRes.id}})
    //                         .update({password: newPass}, (uErr, uRes) => {
    //                             if (uErr) {
    //                                 res.status(400).send(uErr)
    //                             } else {
    //                                 const Activity = require('../../models/Activity')
    //                                 const log = {
    //                                     user_id: fRes.id,
    //                                     ref_id: fRes.id,
    //                                     mode: "User",
    //                                     type: "password",
    //                                     encoded_data: JSON.stringify(uRes),
    //                                     encoded_prev_data: JSON.stringify(fRes)
    //                                 }
    //                                 new Activity()
    //                                     .create(log, () => {
    //                                         res.send("Password reset successful!")
    //                                     })
    //                             }
    //                         })
    //                 } else {
    //                     res.status(400).send(fErr)
    //                 }
    //             }
    //         })
    // }
}

module.exports = new UserController