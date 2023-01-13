const Layout = require('../../email/Layout/index')
const Settings = require('../../models/Settings')
const Email = require('../../models/Email')
const User = require('../../models/User')

const BaseController = require('../../core/BaseController')
const Emailer = require('../../factories/Emailer')
const ResetPassword = require('../../email/templates/resetPassword')
class EmailController extends BaseController {

    get = async (req, response) => {
        let emails      = new Email()   
        const {query}   = req

        this.filter(emails, query)
        this.sort(emails, query.sort)

        const result = await emails.paginate(query.pageSize, query.page)
        this.response(result, response)
    }

    store = async (req, response) => {
        const emailOptions = req.body.send_to.map(to => ({
            to,
            cc: req.body.cc ? req.body.cc : null,
            bcc: req.body.bcc ? req.body.bcc : null,
            subject: req.body.subject,
            html: () => req.body.html
        }))
        await new Emailer("noreply").send(emailOptions)
        response.send({ message: "Email has been enqueue" })
    }

    edit = async (req, response) => {
        if (!req.params.id) response.status(204).send("Missing id request parameter")

        let result = await new Email()
                                    .where({"id": {value: req.params.id}})
                                    .first()
                                    
        if (result && !result.error) {
            const settings = await new Settings().get()
            result = { ...result, ...{ html: Layout(result.html, settings) } }
        }

        this.response(result, response)
    }

    update = async (req, response) => {
        if (req.params.id) {
            const result = await new Email()
                                        .where({id: {value: req.params && req.params.id ? req.params.id : 0}})
                                        .update(req.body)
            
            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    delete = async (req, response) => {
        const ids = req.body && req.body.ids

        if (ids && Array.isArray(ids) && ids.length > 0) {
            const result = await new Email().delete(ids)
            this.response(result, response)
        }
        else this.sendError("Missing request parameter.", response)
    }

    resend = async (req, res) => {
        const id = req.params.id

        await new Emailer("noreply")
            .resend(id, status => {
                if (status === "sent") res.send(status)
                else res.status(400).send({ message: "Email resend failed." })
            })
    }

    testView = async (req, response) => {
        const settings =    await new Settings().get()
        const result =      await new User()
                                .where({id: { value: 4 }})
                                .first()

        response.send(Layout(ResetPassword({result}), settings))
    }
}

module.exports = new EmailController