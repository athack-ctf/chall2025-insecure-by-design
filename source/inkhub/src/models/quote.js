module.exports = (sequelize, DataTypes) => {
    const Quote = sequelize.define('Quote', {
        quoteId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        quoteText: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isInspiring: {
            type: DataTypes.BOOLEAN,
            // Default value for a new quote
            defaultValue: false,
            allowNull: false,
        },
        quoteColor: {
            type: DataTypes.STRING,
            defaultValue: "#000000",
            allowNull: false,
        },
        clapCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            // Ensure that userId cannot be null
            allowNull: false,
        },
    });

    // Static method to retrieve quotes with nested user data
    Quote.getQuotesWithUsers = async function () {
        try {
            let quotes = await this.findAll({
                include: [
                    {
                        model: sequelize.models.User,
                        attributes: ['userId', 'username', 'userHash', 'isAdmin'],
                    }
                ],
                order: [['createdAt', 'DESC']],
                raw: true,
                // Order by createdAt descending
                nest: true,
            });
            return quotes;
        } catch (error) {
            console.error('Error retrieving quotes with users:', error);
            throw error;
        }
    };

    return Quote;
};
