const settings = require('../../config');

module.exports = ({ user }) => {
    const { base, site } = settings.URL;

    return `
        <div>
            <div class="pa-15">
                <h1 class="txt-center header">
                    Reset Passsword
                </h1>
                <div class="mt-50">
                    Hi ${ user.first_name },
                </div>
                <div class="mt-20"">
                    Your password has been reset to <b class="txt-blue">${ user.password }</b>.
                    <br/>
                    You can now <a href="${site}/signin">login</a> to your account with your new password.
                    <br/>
                    Go to your account profile to change your password.
                </div>
            </div>
        </div>
    `;
}