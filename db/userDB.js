var crypto = require('crypto');
let pgPooll;


function register(username, password, cbFunc) {
    var shaPass = crypto.createHash('sha256').update(password).digest('hex');

    const query = `INSERT INTO users (username, user_password) VALUES ('${username}', '${shaPass}')`;

    pgPooll.query(query, cbFunc);

}

function getUser(username, password, cbFunc) {
    var shaPass = crypto.createHash('sha256').update(password).digest('hex');

    const getUserQuery = `SELECT * FROM users WHERE username = '${username}' AND user_password = '${shaPass}'`;

    pgPooll.query(getUserQuery, (response) => {
        cbFunc(
            false,
            response.results && response.results.rowCount === 1
                ? response.results.rows[0]
                : null
        );
    });
}


function isValidUserl(username, cbFunc) {
    const query = `SELECT * FROM users WHERE username = '${username}'`;

    const checkUsrcbFunc = (response) => {
        const isValidUser = response.results
            ? !(response.results.rowCount > 0)
            : null;

        cbFunc(response.error, isValidUser);
    };

    pgPooll.query(query, checkUsrcbFunc);
}


module.exports = (injectedPgPool) => {
    pgPooll = injectedPgPool;

    return {
        register,
        getUser,
        isValidUserl
    }
}