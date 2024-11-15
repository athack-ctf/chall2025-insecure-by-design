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

    // Static method to check if a quote exists by its quoteId
    Quote.doesQuoteExist = async function (quoteId) {
        try {
            const quote = await this.findOne({
                where: {quoteId},
            });

            return !!quote; // Returns true if quote exists, false otherwise
        } catch (error) {
            console.error('Error checking if quote exists:', error);
            throw error;
        }
    };

    // Static method to increment clapCount by a given number for a specific quote
    Quote.incrementClaps = async function (quoteId, clapsToAdd) {
        try {
            const quote = await this.findOne({
                where: {quoteId},
            });

            if (!quote) {
                throw new Error('Quote not found');
            }

            // Increment the clap count and ensure it does not exceed 9999
            quote.clapCount = Math.min(quote.clapCount + clapsToAdd, 9999);

            // Save the updated quote
            await quote.save();

            return quote; // Return the updated quote
        } catch (error) {
            console.error('Error incrementing clapCount:', error);
            throw error;
        }
    };

    return Quote;
};
