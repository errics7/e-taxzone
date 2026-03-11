module.exports = (db) => {
    const { users, taxpayer, users_role, djp_authorization } = db;

    // Pastikan semua model ada sebelum membuat asosiasi
    if (!users || !taxpayer || !users_role || !djp_authorization) {
        console.error('Missing models:', {
            users: !!users,
            taxpayer: !!taxpayer,
            users_role: !!users_role,
            djp_authorization: !!djp_authorization
        });
        return;
    }

    try {
        // User - Taxpayer relationship (bidirectional)
        users.hasOne(taxpayer, {
            foreignKey: 'user_id',
            as: 'taxpayerData',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        taxpayer.belongsTo(users, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // User Role relationships
        // if (users_role) {
        //     users_role.hasMany(users, {
        //         foreignKey: 'role',
        //         as: 'roleUsers'
        //     });

        //     users.belongsTo(users_role, {
        //         foreignKey: 'role',
        //         targetKey: 'role_id',
        //         as: 'role_permission'
        //     });
        // }

        // DJP Authorization relationships
        // User -> DJP Authorization (One-to-Many)
        users.hasMany(djp_authorization, {
            foreignKey: 'user_id',
            as: 'djpAuthorizations',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        djp_authorization.belongsTo(users, {
            foreignKey: 'user_id',
            as: 'user',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Taxpayer -> DJP Authorization (One-to-Many)
        taxpayer.hasMany(djp_authorization, {
            foreignKey: 'taxpayer_id',
            as: 'authorizations',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        djp_authorization.belongsTo(taxpayer, {
            foreignKey: 'taxpayer_id',
            as: 'taxpayer',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });

        // Processed By relationship (admin user who processed the request)
        users.hasMany(djp_authorization, {
            foreignKey: 'processed_by',
            as: 'processedAuthorizations',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        djp_authorization.belongsTo(users, {
            foreignKey: 'processed_by',
            as: 'processedBy',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE'
        });

        // Add manual associations if not already set up
        if (!users.associations.taxpayerData) {
            users.hasOne(taxpayer, {
                foreignKey: 'user_id',
                as: 'taxpayerData'
            });

            taxpayer.belongsTo(users, {
                foreignKey: 'user_id',
                as: 'user'
            });
        }

        console.log('All associations created successfully');
    } catch (error) {
        console.error('Error creating associations:', error.message);
    }
};