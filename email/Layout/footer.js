const config = require('../../config');
const moment = require('moment');

module.exports = (settings) => {
    const { base, site } = config.URL;
    const socialMedia = ["facebook-link", "twitter-link", "instagram-link"];
    const settingsJSON = {};
    settings.forEach(setting => settingsJSON[setting.slug] = { ...setting });
    
    return (`
        <div>
            <div class="txt-center" style="">
                ${
                    settings
                        .filter(setting => socialMedia.includes(setting.slug)).map(socMedLink => `
                            <a href="${ socMedLink.value }" style="padding: 10px;" target="_blank">
                                <img src="${base}/assets/img/icons/${ socMedLink.slug.replace("-link", '') }.png" style="width: 40px; height: 40px; object-fit: contain;"/>
                            </a>
                        `)
                        .join()
                        .replace(/,/g, '')
                }
            </div>
            <div class="mt-20 ">
                <a href="${ site }" target="_blank">
                    <img
                        alt="${ settingsJSON["store-name"] }"
                        src="${ base }${ settingsJSON.logo && settingsJSON.logo.asset ? settingsJSON.logo.asset.path : null }"
                        style="max-width: 150px; width: 100%; margin: auto;"
                    />
                </a>
            </div>
            <div class="txt-center">
                ${ settingsJSON["store-name"] && settingsJSON["store-name"].value } © ${ moment().format("YYYY") }
            </div>
        </div>
    `)
};