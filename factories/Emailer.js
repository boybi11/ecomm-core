const nodemailer = require("nodemailer")
const Settings = require('../models/Settings')
const Email = require('../models/Email')
const QueueHelper = require('../helpers/QueueHelper')
//config
const configurations = require('../email/config')
class Emailer {

    constructor(config) {
        this.config = configurations[config]
        this.emailLayout = require('../email/Layout/index')
        
        this.send = this.send.bind(this)
        this.resend = this.resend.bind(this)
    }

    /**
     * REQUIRED PARAMS
     * @param {String} options.to = Email address of receiver: separated by comma for multiple receiver
     * @param {String} options.subject = Subject of the email
     * @param {String} options.html = Content/Body of the email: string should be in html format
     * OPTIONAL PARAMS
     * @param {String} options.cc = Email address of CC receiver: separated by comma for multiple receiver
     * @param {String} options.bcc = Email address of Bcc receiver: separated by comma for multiple receiver
     */
    send = async (options) => {
        const attemptEmail =    this.attemptEmail
        const settings =        await new Settings().get()
        const emails =          (Array.isArray(options) ? [...options] : [options]).map(option => ({ ...option, ...{ send_to: option.to, html: option.html(settings) }}))
        const result =          await new Email().create(emails)

        if (result && !result.error) {
            const resultData = Array.isArray(result.data) ? result.data : [ result.data ]
            await Promise.all(resultData.map(async d => {
                return await attemptEmail({ emailId: d.id })
            }))

            // turn on for queueing
            // const emailQueue = []
            // for (let ctr = 0; ctr < result.result.affectedRows; ctr++) {
            //     emailQueue.push({ emailId: (result.result.insertId + ctr) })
            // }
            // new QueueHelper("email_queue").addJobs({
            //     payload: emailQueue,
            //     concurrency: 1,
            //     onProcess: async (payload) =>  {
            //         const result = await attemptEmail(payload)
            //         return result
            //     }
            // })
        }

        return result
    }

    resend = async (emailId, callback) => {
        await this.attemptEmail({ emailId, callback })
    }

    attemptEmail = async ({ emailId, callback }) => {
        const emailLayout = this.emailLayout
        const settings =    await new Settings().get()
        const email =       await new Email().where({ id: { value: emailId }}).first()
            // START SENDING
        email.html = emailLayout(email.html, settings)
        const result = await this.sendMail({ email })
        if (callback) callback(result)
        return result
    }

    sendMail = async ({ email }) => {
        const config =      this.config
        const transporter = nodemailer.createTransport({ ...config })
        
        return await new Promise(async (resolve, reject)  => {
            console.log("Email Sending Start")
            transporter.sendMail(
                {
                    from: config.auth.user, // sender address
                    to: email.send_to,
                    ...email,
                },
                async (err, info) => {
                    let status = "sent"
                    // console.log("Error", err)
                    // console.log("Info", info)
                    if ( err ) status = "failed"
                    await new Email().where({ id: { value: email.id } }).update({ status, attempt: (email.attempt + 1) })
                    console.log(`Email sending ${ status }`)
                    resolve(status)
                }
            )
        })
    }
}

module.exports = Emailer