const Tag = require('../models/Tag');

class GeneralHelper {

    randomStr(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

     camelCase(str, delimiter = '-') {
        return str.split(delimiter).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')
     }

     extractFileExt(fileName) {
        let ext = "";
        
        if (fileName) {
            const split = fileName.split('.');

            if (split.length > 1) {
                ext = split[split.length - 1];
            }
        }

        return ext;
     }

     slugify (string, direction) {
        let slugified = "";
        direction = direction === undefined ? "forward" : direction;
    
        if (direction === "forward") {
            slugified = string.trim().replace(new RegExp(' ', 'g'), '-').replace(/[^a-zA-Z0-9\-]/g, "");
        } else {
            slugified = string.trim().replace(new RegExp('-', 'g'), ' ');
        }
    
        return slugified.toLowerCase();
    }

    async saveTags (refType, refId, tags = []) {
        if (refType && refId && tags.length) {
            await new Tag()
                .where({
                    ref_type: {value: refType},
                    ref_id: {value: refId}
                })
                .delete([])

            const res = await new Tag().create(
                tags.map(t => ({
                        ref_id: refId,
                        ref_type: refType,
                        name: t
                    })
                )
            )
        }

        return true
    }

    numberWithCommas(n, decimalPlaces = 2) {
        let parts=(parseFloat(n).toFixed(decimalPlaces)).toString().split(".");
        return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    }
};

module.exports = new GeneralHelper;