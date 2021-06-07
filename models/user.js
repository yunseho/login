const Sequelize = require('sequelize')

module.exports = class User extends Sequelize.Model{
    static init(sequelize){
        return super.init({
            userid:{
                type: Sequelize.STRING(20),
                allowNull:false,
                unique:true,
            },
            token:{
                type: Sequelize.STRING(300),
                allowNull : false,
            },
            username:{
                type: Sequelize.STRING(40),
                allowNull : false,
            },
            gender:{
                type:Sequelize.BOOLEAN,
                allowNull:false,
            },
            userdt:{
                type:Sequelize.DATE,
                allowNull:false,
                defaultValue:Sequelize.NOW,
            },
            email: {
                type: Sequelize.STRING(40),
                allowNull: true,
                unique: true,
            },
            nick: {
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            provider: {
                type: Sequelize.STRING(10),
                allowNull: false,
                defaultValue: 'local',
            },
            snsId: {
                type: Sequelize.STRING(30),
                allowNull: true,
            },
        }, {
            sequelize,
            timestamps:false,
            underscored:false,
            paranoid:false,
            modelName:'User',
            tableName:'users',
            charset: 'utf8',
            collate:'utf8_general_ci'
        })
    }
}