const moment = require('moment');

const con = require('./dbconnect');
const defaultValues = {
    "string": '',
    "text": '',
    "int": 0,
    "decimal": 0,
    "date": moment().format("YYYY-MM-DD HH:mm:ss"),
    "datetime": moment().format("YYYY-MM-DD HH:mm:ss")
};
class BaseModel {
    constructor() {
        // console.log(con._allConnections.length)
        // internal use
        this.appendIndex = 0;
        this.withIndex = 0;
        this.whereHasIndex = 0;
        this.travIndex = 0;
        this.logData = null;
        
        // queries
        this.orderQuery = "";
        this.whereQuery = "";
        this.groupQuery = "";
        this.joinQuery = "";

        //relationship and definable values
        this.selectedFields = [];
        this.withTables = [];
        this.whereHasTables = [];
        this.protected = [];
        this.appends = [];

        // configurations
        this.table = "customers";
        this.includeTrash = false;
        this.limit = "";
        this.skip = "";

        this.get = this.get.bind(this);
        this.paginate = this.paginate.bind(this);
        this.retRelationships = this.retRelationships.bind(this);
        this.getAppendedAttributes = this.getAppendedAttributes.bind(this);
    }

    /* USED FOR TESTING QUERIES */
    async testQry() {
        const test = await con.promise().query(`SELECT * from products WHERE test = 1`)
                            .then( result => ({ result: result }) )
                            .catch( error => ({ error }) )
        
        return test
    }

    select(fields) {
        if (fields && Array.isArray(fields) && fields.length > 0) {
            this.selectedFields = this.selectedFields.concat(fields.filter(f => this.selectedFields.indexOf(f) === -1));
        }

        return this;
    }

    unselect(fields) {
        if (fields && Array.isArray(fields) && fields.length > 0) {
            this.protected = this.protected.concat(fields.filter(f => this.protected.indexOf(f) === -1));
        }

        return this;
    }

    max(value) {
        this.limit = ` LIMIT ${value}`;
        return this;
    }

    includeAppend(propName) {
        this.appends.push(propName);
        return this;
    }

    with(tables) {
        if (tables) {
            if (Array.isArray(tables) && tables.length > 0) {
                tables.map(t => {
                    const key = t.split(':')[0];
                    let withKey = t.includes(':') ? t.substr(t.indexOf(':') + 1) : '';

                    if (withKey.startsWith('(') && withKey.endsWith(')')) {
                        withKey = withKey.substring(1)
                        withKey = withKey.replace(/.$/, '');
                    }
                    
                    if (key.startsWith('>')) this.appends.push(key.replace('>', ''))
                    else this.withTables.push(Object.assign({}, this[key](), {key, with: withKey}));
                });
            } else {
                const key = tables.split(':')[0];
                let withKey = tables.includes(':') ? tables.substr(tables.indexOf(':') + 1) : '';
                
                if (withKey.startsWith('(') && withKey.endsWith(')')) {
                    withKey = withKey.substring(1)
                    withKey = withKey.replace(/.$/, '');
                }

                if (key.startsWith('>')) this.appends.push(key.replace('>', ''))
                else this.withTables.push(Object.assign({}, this[key](), {key, with: withKey}));
            }
        }

        return this;
    }

    withTrashed() {
        this.includeTrash = true;
        return this;
    }

    whereHas(tables) {
        if (tables) {
            if (Array.isArray(tables) && tables.length > 0) {
                tables.map(t => {
                    const key = t.split(':')[0];
                    this.whereHas.push(Object.assign({}, this[key](), {key: key}));
                });
            } else {
                this.whereHas.push(Object.assign({}, this[tables.split(':')[0]](), {key: tables}));
            }
        }

        return this;
    }

    where(pairs) {
        if (pairs && typeof pairs === "object") {
            Object.keys(pairs).map(key => {
                if (pairs[key].value !== undefined) {
                    if (this.whereQuery) {
                        this.whereQuery += " AND";
                    } else {
                        this.whereQuery += " WHERE";
                    }
    
                    this.whereQuery += ` ${key}${pairs[key].operation ? pairs[key].operation : "="}${parseValue(pairs[key].value, this.fillables[key])}`;
                } else if (pairs[key].range && Array.isArray(pairs[key].range)) {
                    if (this.whereQuery) {
                        this.whereQuery += " AND";
                    } else {
                        this.whereQuery += " WHERE";
                    }
                    
                    if (pairs[key].range[0]) {
                        this.whereQuery += ` ${key}>=${parseValue(pairs[key].range[0], this.fillables[key])}`;
                    }

                    if (pairs[key].range[1]) {
                        this.whereQuery += ` AND ${key}<=${parseValue(pairs[key].range[1], this.fillables[key])}`;
                    }
                }
                
                return key;
            });
        }
        return this;
    }

    whereIn(pairs) {
        if (pairs && typeof pairs === "object") {
            Object.keys(pairs).forEach(key => {
                if (pairs[key] !== undefined && pairs[key].length) {
                    if (this.whereQuery) this.whereQuery += " AND";
                    else this.whereQuery += " WHERE";
                    
                    if (!Array.isArray(pairs[key])) pairs[key] = [pairs[key]];
                    
                    this.whereQuery += ` ${key} IN (${pairs[key].map(v => `'${v}'`).join(',')})`;
                }
            });
        }

        return this;
    }

    whereNotIn(pairs) {
        if (pairs && typeof pairs === "object") {
            Object.keys(pairs).forEach(key => {
                if (pairs[key] !== undefined && pairs[key].length) {
                    if (this.whereQuery) this.whereQuery += " AND";
                    else this.whereQuery += " WHERE";
                    
                    if (!Array.isArray(pairs[key])) pairs[key] = [pairs[key]];
                    
                    this.whereQuery += ` ${key} NOT IN (${pairs[key].map(v => `'${v}'`).join(',')})`;
                }
            });
        }

        return this;
    }

    whereRaw(qry) {
        if (this.whereQuery) {
            this.whereQuery += " AND";
        } else {
            this.whereQuery += " WHERE";
        }

        this.whereQuery += ` ${qry}`;
        return this;
    }

    exclude(excludeValues) {
        if (this.whereQuery) {
            this.whereQuery += " AND";
        } else {
            this.whereQuery += " WHERE";
        }
        
        Object.keys(excludeValues).map(key => {
            if (excludeValues[key]) {
                this.whereQuery += ` ${key} NOT ${Array.isArray(excludeValues[key]) ? `IN (${excludeValues[key].map(exValue => `"${exValue}"`).join(',')})` : `'${excludeValues[key]}'`}`;
            }
            return key;
        });

        return this;
    }

    orderBy(field, order) {
        this.orderQuery += ` ORDER BY ${field} ${order}`;
        return this;
    }

    groupBy(field) {
        this.groupQuery += ` GROUP BY ${field}`;
        return this;
    }

    /**
     * 
     * @param {String} table table where to join 
     * @param {String} condition condition of join
     * @param {String} position poistion of joining
     */
    join(table, condition, position) {
        this.joinQuery += `${`${position ? ' ' + position : '' } `}JOIN ${table} ON ${condition} `;
        return this;
    }

    //CREATE
    create(data, callback) {
        const insertValues = data ? (Array.isArray(data) ? [...data] : [data]) : [],
            logData = Object.assign({}, this.logData, {type: "create"}),
            fillableFields = Object.keys(this.fillables);

        if (insertValues.length) {
            const fields = generateValidFields(this.fillables ? fillableFields :  Object.keys(insertValues[0]), insertValues[0]);
            const generateValues = () => {
                    let values = '';

                    insertValues.map(d => {
                        if (fields.indexOf("created_at") > -1) d.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
                        values += `${values ? ',' : ''} (${fields.map(f => `${parseValue(d[f], this.fillables[f])}`).join(",")})`;
                    });

                    return values;
                };
            
            if (fillableFields.includes('created_at') && !fields.includes('created_at')) fields.push('created_at');

            let query = `INSERT INTO ${this.table} (${fields.join(",")}) VALUES${generateValues()}`;
            con.query(query, function(err, result) {
                //** create loggableData for all inserted rows **//
                const loggableData = result ? [...Array(result.affectedRows)].map((v, i) => {return Object.assign({}, logData, {ref_id: result.insertId + i}) }) : [];
                callback(err, result, loggableData);
            });
        }
        else callback(null, []);
    }

    //UPDATE
    update(data, callback) {
        data.updated_at = moment().format('YYYY-MM-DD HH:mm:ss');
        const fields = generateValidFields(this.fillables ? Object.keys(this.fillables) :  Object.keys(data), data);
        const logData = Object.assign({}, this.logData, {type: "update"});
        
        let query = `UPDATE ${this.table} SET ${fields.map(f => `${f}=${`${parseValue(data[f], this.fillables[f])}`}`).join(",")}${this.whereQuery}`;
        
        con.query(query, function(err, result) {
            callback(err, result, logData);
        });
    }

    //DELETE
    delete(ids = [], callback) {
        const deleted_at = moment().format('YYYY-MM-DD HH:mm:ss'),
            query = ids && ids.length > 0 ? `id IN (${ids.join(',')})` : '',
            logData = ids.map(id => Object.assign({}, this.logData, {type: "delete", ref_id: id}));
            
        if (Object.keys(this.fillables).indexOf("deleted_at") > -1) {
            con.query(`UPDATE ${this.table} SET deleted_at="${deleted_at}" ${this.whereQuery ? (this.whereQuery + (query ? " OR " : '')) : "WHERE "}${query}`, function(err, result) {
                callback(err, ids, logData);
            });
        } else {
            con.query(`DELETE FROM ${this.table} ${this.whereQuery ? (this.whereQuery + (query ? " OR " : '')) : "WHERE "}${query}`, function(err, result) {
                callback(err, ids, logData);
            });
        }
    }

    //RETRIEVE FUNCTIONS
    queryRaw(query, callback) {
        
        con.query(`${query} FROM ${this.table}${queryBuilder(this.whereQuery, this.includeTrash, this.fillables, this.table)}${this.groupQuery}${this.orderQuery}${this.limit}${this.skip}`, function(err, result) {
            callback(err, result);
        });
    }

    async getV2 () {
        const resetTravIndex = () => this.travIndex = 0;
        const derivedRetRel = this.retRelationships;
        const derivedAppAtt = this.getAppendedAttributes;
        const { fillables } = this;
        let query = `SELECT ${selectBuilder(this.selectedFields, this.protected, this.fillables)} FROM ${this.table}`; //-- add SELECT and FROM to the query
        query += this.joinQuery; //-- add join query
        query += queryBuilder(this.whereQuery, this.includeTrash, this.fillables, this.table); // add where queries
        query += this.groupQuery; //-- add grouping query
        query += this.orderQuery; //-- add order query
        query += this.limit; //-- add limit query
        query += this.skip; //-- add skip query
        
        const result = await con.promise().query(query)
                                .then(async result => {
                                    let newResults = decimalTypeCast({data: result[0], fillables});
                                    // this.result = result;
                                    newResults = await this.getAppendedAttributesV2(newResults)
                                    return { result: newResults }
                                    // derivedAppAtt(newResults && newResults.length && newResults[0], newResults, () => {
                                    //     resetTravIndex();
                                    //     derivedRetRel(newResults && newResults.length && newResults[0], newResults, () => {
                                    //         if (callback) callback(null, newResults);
                                    //     });
                                    // })
                                })
                                .catch(error => ({ error }))

        return result
    }

    get(callback) {
        const resetTravIndex = () => this.travIndex = 0;
        const derivedRetRel = this.retRelationships;
        const derivedAppAtt = this.getAppendedAttributes;
        const { fillables } = this;
        let query = `SELECT ${selectBuilder(this.selectedFields, this.protected, this.fillables)} FROM ${this.table}`; //-- add SELECT and FROM to the query
        query += this.joinQuery; //-- add join query
        query += queryBuilder(this.whereQuery, this.includeTrash, this.fillables, this.table); // add where queries
        query += this.groupQuery; //-- add grouping query
        query += this.orderQuery; //-- add order query
        query += this.limit; //-- add limit query
        query += this.skip; //-- add skip query
        
        con.query(query, function(err, result) {
            let newResults = decimalTypeCast({data: result, fillables});
            this.result = result;
            derivedAppAtt(newResults && newResults.length && newResults[0], newResults, () => {
                resetTravIndex();
                derivedRetRel(newResults && newResults.length && newResults[0], newResults, () => {
                    callback(err, newResults);
                });
            })
        });
    }

    first(callback) {
        const resetTravIndex = () => this.travIndex = 0;
        const derivedRetRel = this.retRelationships;
        const derivedAppAtt = this.getAppendedAttributes;
        const { fillables } = this;
        con.query(`SELECT ${selectBuilder(this.selectedFields, this.protected, this.fillables)} FROM ${this.table}${queryBuilder(this.whereQuery, this.includeTrash, this.fillables, this.table)}${this.groupQuery}${this.orderQuery}${this.limit}${this.skip} LIMIT 1`, function(err, result) {
            let newResults = decimalTypeCast({data: result, fillables});
            derivedAppAtt(newResults && newResults.length && newResults[0], newResults, () => {
                resetTravIndex();
                derivedRetRel(newResults && newResults.length && newResults[0], newResults, () => {
                    callback(err, newResults ? newResults[0] : null);
                });
            });
        });
    }

    paginate(pageSize = 15, currentPage = 1, callback) {
        const { fillables } = this;
        const resetWithIndex = () => {
            this.withIndex = 0;
            this.travIndex = 0;
        };

        const paginationCallback = (pagination) => {
            const derivedRetRel = this.retRelationships;
            const derivedAppAtt = this.getAppendedAttributes;
            let query = `SELECT ${selectBuilder(this.selectedFields, this.protected, this.fillables)} FROM ${this.table}`;

            query += this.joinQuery; //-- add join query
            query += queryBuilder(this.whereQuery, this.includeTrash, this.fillables, this.table); // add where queries
            query += this.groupQuery; //-- add grouping query
            query += this.orderQuery; //-- add order query
            
            con.query(`${query} LIMIT 1;${query} LIMIT ${pageSize} OFFSET ${(currentPage - 1) * pageSize}`, function(err, result) {
               
                pagination.firstData = result && result[0] ? decimalTypeCast({data: result[0], fillables})[0] : null;
                pagination.data = result ? decimalTypeCast({data: result[1], fillables}) : null;

                if (pagination.firstData) {
                    derivedAppAtt(pagination.firstData, [pagination.firstData], () => {
                        derivedRetRel(pagination.firstData, [pagination.firstData], () => {
                            resetWithIndex();
                            this.appendIndex = 0;
                            derivedAppAtt(pagination.data[0], pagination.data, () => {
                                derivedRetRel(pagination.data[0], pagination.data, () => {
                                    callback(err, pagination);
                                });
                            });
                        });
                    });
                }
                else callback(err, pagination);
            });
        }

        con.query(`SELECT COUNT(*) as total FROM ${this.table} ${queryBuilder(this.whereQuery, this.includeTrash, this.fillables, this.table)};SELECT COUNT(*) as total FROM ${this.table}`, function(err, result) {
            
            if (err) callback(err, null);
            else {
                currentPage = parseInt(currentPage);
                const start = result[0][0].total === 0 ? 0 : ((pageSize * (currentPage - 1)) + 1);
                const last = pageSize * currentPage;
                let pagination = {
                    rawTotal: result[1][0].total,
                    total: result[0][0].total,
                    pages: Math.ceil(result[0][0].total / pageSize),
                    currentPage,
                    prevPage: currentPage > 1 ? currentPage - 1 : 1,
                    pageSize,
                    showing: `${start} - ${last > result[0][0].total ? result[0][0].total : last}`
                };

                pagination.nextPage = pagination.currentPage < pagination.pages ? pagination.currentPage + 1 : pagination.pages;
                pagination.data = [];

                if (parseInt(result[0][0].total) > 0) paginationCallback(pagination);
                else callback(err, pagination);
            }
        });
    }

    //RELATIONSHIPS
    hasOne(model, fKey, sKey = "id", qry, transform) {
        return {relType: 'first', model, fKey, sKey, qry, transform};
        
    }

    hasMany(model, fKey, sKey = "id", qry, transform) {
        return {relType: 'get', model, fKey, sKey, qry, transform};
    }

    //RELATIONSHIP FUNCTIONS
    retRelationshipsV2 = (data, list, callback) => {
        // console.log(this.travIndex);
        if (this.withTables.length > 0 && data) {
            const withTables = this.withTables;
            let relKey = withTables[this.withIndex].key;
            const relConfig = withTables[this.withIndex];
            const table = require(`../models/${relConfig.model}`);
            const withIndex = this.withIndex += 1;
            const travIndex = this.travIndex += (withTables[withIndex] ? 0 : 1);
            const derivedRetRel = this.retRelationships;
            const resetWithIndex = () => {this.withIndex = 0};
            
            if (data[relConfig.sKey]) {
                let hasQry = new table();

                if (relConfig.with) {
                    hasQry = hasQry.with(relConfig.with.split(/-(?![^()]*(?:\([^()]*\))?\))/));
                }

                if (relConfig.qry && typeof relConfig.qry === "object") {
                    Object.keys(relConfig.qry).map(q => {
                        hasQry = hasQry[q](relConfig.qry[q]);
                    });
                }

                hasQry.where({
                    [relConfig.fKey]: {value: data[relConfig.sKey]}
                })
                [relConfig.relType](function(err, res) {
                    
                    relKey = extractRelKey(relKey);
                    data[relKey] = res ? res : null;

                    if (relConfig.transform) {
                        data[relKey] = relConfig.transform(data[relKey]);
                    }
                    
                    if (withTables[withIndex]) {
                        derivedRetRel(data, list, callback);
                    } else {
                        resetWithIndex();
                        if (list[travIndex]) {
                            derivedRetRel(list[travIndex], list, callback);
                        } else {
                            callback();
                        }
                    }
                });
            } else {
                if (withTables[withIndex]) {
                    derivedRetRel(data, list, callback);
                } else {
                    resetWithIndex();
                    if (list[travIndex]) {
                        derivedRetRel(list[travIndex], list, callback);
                    } else {
                        callback();
                    }
                }
            }
        } else {
            callback();
        }
    }

    retRelationships = (data, list, callback) => {
        // console.log(this.travIndex);
        if (this.withTables.length > 0 && data) {
            const withTables = this.withTables;
            let relKey = withTables[this.withIndex].key;
            const relConfig = withTables[this.withIndex];
            const table = require(`../models/${relConfig.model}`);
            const withIndex = this.withIndex += 1;
            const travIndex = this.travIndex += (withTables[withIndex] ? 0 : 1);
            const derivedRetRel = this.retRelationships;
            const resetWithIndex = () => {this.withIndex = 0};
            
            if (data[relConfig.sKey]) {
                let hasQry = new table();

                if (relConfig.with) {
                    hasQry = hasQry.with(relConfig.with.split(/-(?![^()]*(?:\([^()]*\))?\))/));
                }

                if (relConfig.qry && typeof relConfig.qry === "object") {
                    Object.keys(relConfig.qry).map(q => {
                        hasQry = hasQry[q](relConfig.qry[q]);
                    });
                }

                hasQry.where({
                    [relConfig.fKey]: {value: data[relConfig.sKey]}
                })
                [relConfig.relType](function(err, res) {
                    
                    relKey = extractRelKey(relKey);
                    data[relKey] = res ? res : null;

                    if (relConfig.transform) {
                        data[relKey] = relConfig.transform(data[relKey]);
                    }
                    
                    if (withTables[withIndex]) {
                        derivedRetRel(data, list, callback);
                    } else {
                        resetWithIndex();
                        if (list[travIndex]) {
                            derivedRetRel(list[travIndex], list, callback);
                        } else {
                            callback();
                        }
                    }
                });
            } else {
                if (withTables[withIndex]) {
                    derivedRetRel(data, list, callback);
                } else {
                    resetWithIndex();
                    if (list[travIndex]) {
                        derivedRetRel(list[travIndex], list, callback);
                    } else {
                        callback();
                    }
                }
            }
        } else {
            callback();
        }
    }

    getAppendedAttributesV2 = async (result) => {
        let newResult = []
        if (this.appends && this.appends.length) {
            await Promise.all(result.map( async data => {
                
                await Promise.all(this.appends.map(async appendable => {
                    const appendKey = appendable
                                        .split('_')
                                        .map(word => {
                                            return word.charAt(0).toUpperCase() + word.slice(1);
                                        })
                                        .join('');
                                        
                    if (this[`append${appendKey}`]) data = await this[`append${appendKey}`](data)

                    return data
                }))

                newResult.push(data)
                return data
            }))
        }

        return newResult
    }

    getAppendedAttributes (data, list, callback) {
        const derivedAppAtt = this.getAppendedAttributes;
            
        if (this.appends.length && data) {
            if (this.appends[this.appendIndex]) {
                const appendKey = this.appends[this.appendIndex]
                                    .split('_')
                                    .map(word => {
                                        return word.charAt(0).toUpperCase() + word.slice(1);
                                    })
                                    .join('');
                if (this[`append${appendKey}`]) {
                    this[`append${appendKey}`](data, () => {
                        this.appendIndex++;
                        if (this.appends[this.appendIndex]) {
                            derivedAppAtt(data, list, callback);
                        } else {
                            this.travIndex += 1;
                            if (list[this.travIndex]) {
                                this.appendIndex = 0;
                                derivedAppAtt(list[this.travIndex], list, callback);
                            } else {
                                this.travIndex = 0;
                                this.appendIndex = 0;
                                callback();
                            }
                        }
                    })
                } else {
                    if (this.appendIndex > this.appends.length) {
                        this.appendIndex = 0;
                        this.travIndex = 0;
                        callback();   
                    }
                }
            } else {
                if (this.appendIndex > this.appends.length) {
                    this.travIndex = 0;
                    this.appendIndex = 0;
                }
                callback();
            }
        } else {
            callback();
        }
    }

    //LOG
    log = (data, authId, refId = 0) => {
        
        if (data && authId !== undefined) {
            this.logData = {
                encoded_data: JSON.stringify(data),
                user_id: authId,
                model: this.constructor.name,
                ref_id: refId
            };
        }

        return this;
    }

    //native tag relationship
    tags = () => {
        const transform = (result) => {
            if (result && !result.error) return result.map(r => r.name)
            return result
        }

        return this.hasMany('Tag', 'ref_id', 'id', {where: {"ref_type": { value: this.table }}}, transform)
    }
}

extractRelKey = (key) => {
    let relKey = key;
    const relWith = key.indexOf(":");

    if (relWith > -1) {
        relKey = relKey.substr(0, relWith);
    }

    return relKey;
}

generateValidFields = (fillables, data) => {
    let fields = [];
    fillables.map(f => {
        if (data[f] !== undefined) {
            fields.push(f);
        }
    });

    return fields;
}

queryBuilder = (currentQuery, includeTrash, fillables, table) => {
    const softDelete = Object.keys(fillables).indexOf(`deleted_at`) > -1;
    
    if (!includeTrash && softDelete) {
        const softDeleteQry = `${table}.deleted_at IS NULL`;
        if (currentQuery) {
            currentQuery += ` AND ${softDeleteQry} `;
        } else {
            currentQuery = ` WHERE ${softDeleteQry}`;
        }
    }

    return currentQuery;
}

selectBuilder = (selectedFields, protected, fillables) => {
    let select = "*",
        availableFields = Object.keys(fillables);

    if (protected.length > 0) {
        availableFields = availableFields.filter(f => protected.indexOf(f) === -1);
    }

    if (selectedFields.length > 0) {
        select = selectedFields.join(',');
    } else {
        select = "id," + availableFields.join(',');
    }

    return select;
}

parseValue = (value, type) => {
    let parsed = (value === "null" || value === null || !value) && type !== "decimal" && type !== "int" ? 'NULL' : defaultValues[type];
    
    if (value && parsed !== 'NULL') {
        switch (type) {
            case "datetime":
                parsed = moment(value).format('YYYY-MM-DD HH:mm:ss');
                break;
            case "date":
                parsed = moment(value).format('YYYY-MM-DD');
                break;
            case "int":
            case "decimal":
                parsed = parseFloat(value ? value : 0);
                break;
            case "string":
                parsed = value.toString();
            default:
                parsed = value;
                break;
        }
    }

    return parsed !== 'NULL' ? `'${parsed}'` : parsed;
}

decimalTypeCast = ({data, fillables}) => {
    if (data) {
        const fields = Object.keys(fillables).filter(field => fillables[field] === "decimal");
        if (fields.length) {
            data = data.map(row => {
                let newRow = {...row};

                fields.forEach(field => newRow[field] = parseFloat(row[field]));
                return newRow;
            });
        }
    }

    return data;
}

module.exports = BaseModel;