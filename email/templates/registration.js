const settings = require('../../config');

module.exports = ({ token }) => {
    const { base, site } = settings.URL;

    return `
        <div>
            <div class="pa-15 txt-center">
                <div>
                    <img style="max-width: 250px; width: 100%; margin: auto;" src="${ base }/assets/img/registration.png" />
                </div>
                <div class="header">
                    Yey! Your registration was successful
                </div>
                <div class="mt-20">
                    Your just one step away from completing the process. Just click on the link below to activate your newly created account.
                </div>
                <a href="${ site }/account/activate/${ token }">
                    ${ site }/account/activate/${ token }
                </a>
            </div>
        </div>
    `;
}