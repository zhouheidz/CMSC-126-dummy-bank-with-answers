const Sequelize = require('sequelize');
const database = require('./database');

const User = database.define('users', {
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
    name: {
        type: Sequelize.STRING
    },
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	timestamps: true
});

const Account = database.define('accounts', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    balance: {
        type: Sequelize.FLOAT,
        defaultValue: 0
    },
    user_id: {
        type: Sequelize.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    timestamps: true
});

database.sync();

module.exports.User = User;
module.exports.Account = Account;
