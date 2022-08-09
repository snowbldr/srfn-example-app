const { db } = require('./db')

const user = db.collection('user', {
    idGenerator: user => user.username,
    schema: {
        title: 'user',
        type: 'object',
        properties: {
            id: {
                type: "string",
                nullable: false,
                minLength: 3,
                maxLength: 150
            },
            username: {
                type: "string",
                nullable: false,
                minLength: 3,
                maxLength: 100
            },
            email: {
                type: "string",
                format: "email",
                nullable: false
            },
            roles: {
                type: "array",
                items: {
                    type: "string",
                }
            }
        },
        required: ['username', 'id', 'email'],
        additionalProperties: false
    }
})

const userAuth = db.collection('user-auth', {
    idField: 'username',
    schema: {
        title: 'user',
        type: 'object',
        properties: {
            username: {
                type: "string",
                nullable: false,
                minLength: 3,
                maxLength: 150
            },
            resetId: {
                type: "string",
                format: "uuid",
                nullable: true
            },
            resetAt: {
                anyOf: [
                    {
                        type: "object",
                        instanceof: "Date"
                    },
                    {
                        type: 'null'
                    }
                ]
            },
            lockedAt: {
                anyOf: [
                    {
                        type: "object",
                        instanceof: "Date"
                    },
                    {
                        type: 'null'
                    }
                ]
            },
            failedLogins: {
                type: "integer"
            },
            passwordHash: {
                type: "string"
            },
            salt: {
                type: "string"
            }
        },
        required: ['passwordHash', 'salt', 'username'],
        additionalProperties: false
    }
})

module.exports = {
    getUser: user.findOneById,
    saveUser: user.save,
    patchUser: user.upsert,
    getUserAuth: userAuth.findOneById,
    saveUserAuth: userAuth.save,
    patchUserAuth: userAuth.upsert,
    deleteUser: async ( username ) => {
        await user.deleteById( username )
        await userAuth.deleteById( username )
    }
}