const Oxen      = require('oxen-queue')
const settings  = require('../config')

class QueuetHelper {
    constructor(jobType) {
        this.ox = new Oxen({
            mysql_config: settings.DB,
            job_type: jobType
        })
    }

    addJobs = async ({ payload, onProcess, concurrency = 25 }) => {
        
        this.ox.addJobs(payload)
        this.ox.process({
            work_fn : async function (job_body) {
                await onProcess(job_body)
                return "success"
            },
            concurrency
        })
    }

    recoverStuckJobs = () => this.ox.recoverStuckJobs("product_import")
}

module.exports = QueuetHelper;