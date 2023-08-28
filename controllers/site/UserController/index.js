const moment    = require('moment')
const User      = require('../../../models/User')
const Order     = require('../../../models/Order')
const Asset     = require('../../../models/Asset')

const GeneralHelper = require('../../../helpers/GeneralHelper')
const LogHelper     = require('../../../helpers/LogHelper')
const EncHelper     = require('../../../helpers/EncHelper')
//facotries
// const Emailer = require('../../../factories/Emailer')
//emailTemplate
// const RegistrationEmail = require('../../email/templates/registration')
// const ResetPassword     = require('../../../email/templates/resetPassword')
const BaseController    = require('../../../core/BaseController')
const config            = require('./config')

class UserController extends BaseController {
    
    auth = async (req, response) => {
        const user = await new User()
                                .select(config.authSelect)
                                .whereRaw(`(username='${req.body.email}' OR email='${req.body.email}')`)
                                .where({ "password": {value: req.body.password} })
                                .first()

        if (user && !user.error) {
            if (user.is_activated) {
                const ts     = moment().format()
                const jwt    = {
                                    id: user.id,
                                    cms: user.cms,
                                    last_activity: ts,
                                    ip: req.ip,
                                    userAgent: req.get("user-agent")
                                }
                const update = await new User()
                                        .log(user, user.id, user.id)
                                        .where({ id: { value: user.id } })
                                        .update({ last_login: ts })
                
                if (update && !update.error) {
                    const result         = { ...user, token: EncHelper.encrypt(jwt) }
                    update.loggable.type = "login"
                    await LogHelper.logActivity(update.loggable)

                    delete result.is_activated
                    this.response(result, response)
                }
                else this.response(update, response)
            }
            else this.sendError("Please activate your account first. We sent an email activation to your email address.", response)
        }
        else this.sendError("Invalid username or password.", response)
            
    }

    validate = async (req, response) => {

        if (!req.authUser) this.sendError("Invalid token", response)
        else {
            const result = await new User()
                                    .select(config.authSelect)
                                    .with(["asset", "lastOrder", "primaryAddress"])
                                    .find(req.authUser.id)

            this.response(result, response)
        }
    }

    store = async (req, response) => {
        const token     = GeneralHelper.randomStr(75)
        const slug      = req.body.first_name + moment().unix()
        const data      = { ...req.body, token, slug }

        const create = await new User()
                                .log(data, req.authUser ? req.authUser.id : 0)
                                .create(data)

        if (create && !create.error) {
            create.loggable[0].user_id = create.result.insertId
            await LogHelper.logActivity(create.loggable)
        }

        // new Emailer("noreply").send({
        //     to: data.email,
        //     subject: "Account Activation!",
        //     html: (siteDetails) => RegistrationEmail({ token })
        // })
        this.response(create, response)
    }

    find = async (req, response) => {
        if (!req.query.id && !req.query.slug) {
            res.status(400).send("Missing id request parameter")
        }
        
        new User()
            .with(["asset", "addresses"])
            .where(req.query.slug ? {slug: {value: req.query.slug}} : {"id": {value: req.query.id}})
            .first(function(err, result) {
                if (err) {
                    res.status(400).send(err)
                } else {
                    if (result) {
                        res.send(result)
                    } else {
                        res.status(400).send({})
                    }
                }
            })
    }

    update = async (req, response) => {
        if (req.authUser && req.authUser.id) {
            const userId    = req.authUser.id
            const payload   = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email: req.body.email,
                                phone: req.body.phone,
                                gender: req.body.gender,
                            }
            const user      = await new User()
                                    .with([ "asset" ])
                                    .log(payload, userId, userId)
                                    .where({id: { value: userId }})
                                    .update(payload)

            if (user && !user.error) {
                await LogHelper.logActivity(user.loggable)
                this.response(user.data, response)
            }
            else this.response(user, response)
        }
        else this.sendError("Unprocessable payload", response)
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
    //                                 new Emailer("noreply").send({
    //                                     to: fRes.email,
    //                                     subject: "Reset Password",
    //                                     html: (siteDetails) => ResetPassword({ user: {...fRes, password: newPass} })
    //                                 })

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

    changePassword = async (req, response) => {
        if (req.authUser && req.body.o_pass && req.body.n_pass) {
            const { body } = req

            if (body.n_pass === body.r_pass) {
                const user = await new User()
                                        .where({
                                            id: { value: req.authUser.id },
                                            password: { value: body.o_pass }
                                        })
                                        .first()

                if (user) {
                    const update = await new User()
                                        .where({ id: { value: req.authUser.id } })
                                        .update({ password: body.n_pass })

                    if (update.error) this.response(update, response)
                    response.status(204).send()
                }
                else this.sendError("Old password mismatch", response)
            }
            else return this.sendError("Re-type password mismatch", response)
        }
        else this.sendError("Unprocessable request!", response)
    }

    verifyAccount = async (req, response) => {
        const { email } = req.body

        if (email) {
            const user = await new User()
                                    .where({
                                        email: { value: email },
                                        is_activated: { value: 0 }
                                    })
                                    .first()

            if (!user) this.sendError("Invalid email", response, { code: 666 })
            else {
                const updateFields = { token: GeneralHelper.randomStr(75), is_activated: 1 }
                await new User()
                            .where({ id: { value: user.id } })
                            .update(updateFields)

                this.response({ ...user, ...updateFields }, response)
            }
        }
        else this.sendError("Invalid email", response, { code: 666 })
    }

    getOrderStatusCount(req, res) {
        new Order()
            .where({
                status: {value: "cart", operation: "!="},
                user_id: {value: req.authUser.id}
            })
            .select([`COUNT("status") as total`, "status"])
            .groupBy("status")
            .get(function(err, result) {
                if (err) res.status(400).send({ message: "Something went wrong!" })
                else res.send(result)
            })
    }

    logout(req, res) {
        const token = GeneralHelper.randomStr(75)
        new User()
            .log({token}, req.authUser.id, req.authUser.id)
            .where({id: {value: req.authUser.id}})
            .update({token}, function (err, result, loggable) {
                if (err) {
                    res.status(400).send(err)
                } else {
                    if (result) {
                        loggable.type = "logout"
                        LogHelper.logActivity(loggable, () => res.status(204).send())
                    } else {
                        res.status(204).send({})
                    }
                }
            })
    }

    getRankedItems(req, res) {
        const OrderItem = require('../../models/OrderItem')

        new Order()
            .select(["id"])
            .where({
                user_id: { value: req.authUser.id },
                is_paid: { value: 1 }
            })
            .get(function(err, data) {
                const orderids = data.map(d => d.id)

                new OrderItem()
                    .with(["product:asset->rating_stats"])
                    .select(['product_id', "COUNT(product_id) as count", "products.deleted_at", "products.parent"])
                    .join("products", "order_items.product_id = products.id")
                    .whereIn({ order_id: orderids})
                    .whereRaw(`(status != "cart" OR status != "cancelled" OR status != "refunded") AND products.deleted_at IS NULL AND products.with_variant = 0`)
                    .max(5)
                    .groupBy("product_id")
                    .orderBy("count", "DESC")
                    .get(function(err, data) {
                        if (err) res.status(400).send({ message: "Something went wrong!" })
                        else res.send(data)
                    })
            })
    }
}

module.exports = new UserController