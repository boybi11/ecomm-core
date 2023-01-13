module.exports = {
    "noreply": {
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user:  "boybi.oyales@gmail.com",
            pass: "zmrtfyozxynnoxau"
        },
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false
        },
        ignoreTLS: true
    }
};