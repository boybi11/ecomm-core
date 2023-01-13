const Bull = require('bull')
require('dotenv').config()

class Queue {
    constructor(name = "queue", options = {}, processor) {
        this.bull = new Bull(name, {
            redis: {
                host: process.env.REDIS_HOST,
                port: process.env.REDIS_PORT,
                legacyMode: true
            },
            ...options
        })
        if (processor) this.process(processor.process, processor.concurrency)
    }

    process = (processor, concurrency = 1) => {
        this.bull.process(concurrency, processor)
    }

    addJob = (data, options) => {
        this.bull.add(data, options)
    }

    addJobs = (jobs, options) => {
        this.bull.addBulk(jobs, options)
    }

    getJobsCount = async () => {
        return await this.bull.getJobCounts()
    }

    on = (event, callback) => {
        return this.bull.on(event, callback)
    }
}

module.exports = Queue