module.exports = ({ address, baseUrl }) => {

    return `
        <div>
            <div class="flex-center border-b pa-15">
                <table class="full-w">
                    <tr>
                        <td>
                            <img src="${ baseUrl }/assets/img/icons/${ address.type }.png" class="icon mr-10" />
                        </td>
                        <td class="full-w">
                            <strong class="txt-capitalize">${ address.type } Address</strong>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="pa-15">
                <div>
                    <strong>Name:</strong> ${ address.first_name } ${ address.last_name }
                </div>
                <div>
                    <strong>Email:</strong> ${ address.email }
                </div>
                <div>
                    <strong>Phone:</strong> ${ address.mobile_number }
                </div>
                <div>
                    <strong>Address</strong>: ${address.address_line}, ${address.area}, ${address.city}, ${address.province} ${address.zip}
                </div>
            </div>
        </div>
    `;
};