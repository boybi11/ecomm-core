const styles = require('./styles');
const footer = require('./footer');

module.exports = (content, siteDetails) => {

    return (
        `
            <!DOCTYPE html>
            <html lang="en">
                <head>
                    <style>
                        ${ styles }
                    </style>
                </head>
                <body>
                    <div class="email-body">
                        ${ content }
                        <div class="mt-50">
                            ${ footer(siteDetails) }
                        </div>
                    </div>
                </body>
            </html>
        `
    );
};