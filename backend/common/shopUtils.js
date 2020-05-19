
let uuid = require('uuid-random');

exports.validateUUIDFormat = function (req) {
    if (!req) {
        return null;
    }
    if (!req.headers || !req.headers.token) {
        return null;
    }
    let uuidFromInternets = req.headers.token
    console.log("shopUtils:isUUID " + uuidFromInternets)
    if (uuidFromInternets.length !== 36) {
        return null;
    }
    if (uuid.test(uuidFromInternets)) {
        return uuidFromInternets;
    }
    return null;
}
