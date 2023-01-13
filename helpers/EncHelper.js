const crypto = require('crypto-js')
const config = require('../config')

exports.encrypt = function (data) {
                    const parsedData    = typeof data === "string" ? data : JSON.stringify(data)
                    const encryptedData = crypto.AES.encrypt(parsedData, config.AppKey).toString()

                    return encryptedData
                }

exports.decrypt = function (data) {
                    const bytes         = crypto.AES.decrypt(data, config.AppKey)
                    let decryptedData  = ''

                    try {
                        decryptedData = JSON.parse(`${ bytes.toString(crypto.enc.Utf8) }`)
                    }
                    catch(err) {}
                    return decryptedData
                }