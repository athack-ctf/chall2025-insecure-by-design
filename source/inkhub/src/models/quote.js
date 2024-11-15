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
    });

    return Quote;
};
