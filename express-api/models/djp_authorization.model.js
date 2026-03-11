const { Sequelize } = require("sequelize");
const sequelizeConf = require("../config/sequelizeconf");

const { DataTypes } = Sequelize;

const DjpAuthorization = sequelizeConf.define('djp_authorization', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    taxpayer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'taxpayer',
            key: 'id'
        }
    },
    request_channel: {
        type: DataTypes.ENUM('daring', 'luring'),
        allowNull: false,
        defaultValue: 'daring'
    },
    request_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    nik_npwp: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    taxpayer_name: {
        type: DataTypes.STRING(200),
        allowNull: false
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    handphone: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    certificate_type: {
        type: DataTypes.ENUM('kode_otorisasi_djp', 'brin', 'bssn', 'peruri', 'privy_id'),
        allowNull: false,
        defaultValue: 'kode_otorisasi_djp'
    },
    passphrase: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    identity_photo: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    statement_accepted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    authorization_code: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
    },
    approval_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    rejection_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    processed_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    created_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'djp_authorization',
    timestamps: false, // We're handling timestamps manually
    indexes: [
        {
            unique: true,
            fields: ['authorization_code']
        },
        {
            fields: ['user_id']
        },
        {
            fields: ['status']
        },
        {
            fields: ['nik_npwp']
        }
    ]
});

module.exports = DjpAuthorization;