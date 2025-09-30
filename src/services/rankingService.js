const User = require("../models/User");
const Rank = require("../models/Rank");
const { calculateActiveCommission, calculatePassiveCommission } = require("../utils/userCommission");

async function rankUsers() {

    const users = await User.find();

    const usersIncomeDetails = [];

    for (let k = 0; k < users.length; k++) {

        let userDetails = users[k];

        let activeUsers = await User.find({
            introducerreference: users[k].userreference,
        });

        // filter out active users 
        activeUsers = activeUsers.filter(user => user.isActive !== false);

        let passiveUsers = [];

        for (let i = 0; i < activeUsers.length; i++) {
            let tempUsers = await User.find({
                introducerreference: activeUsers[i].userreference,
            });
            passiveUsers = passiveUsers.concat(tempUsers);
        }

        // filter out active users 

        passiveUsers = passiveUsers.filter(user => user.isActive !== false);

        const activeUsersVar = activeUsers.map((person) => ({
            commission: calculateActiveCommission(person.products, person.createdAt, users[k].products)
        }));

        const passiveUsersVar = passiveUsers.map((person) => ({
            commission: calculatePassiveCommission(person.products, person.createdAt, users[k].products)
        }));

        const activeIncomeVar = activeUsersVar.reduce(
            (previousValue, currentValue) => previousValue + parseInt(currentValue.commission, 10),
            0
        );

        const passiveIncomeVar = passiveUsersVar.reduce(
            (previousValue, currentValue) => previousValue + parseInt(currentValue.commission, 10),
            0
        );

        userDetails = { userreference: userDetails.userreference, activeIncomeVar, passiveIncomeVar, totalIncomeVar: passiveIncomeVar + activeIncomeVar }

        usersIncomeDetails.push(userDetails);
    }

    const sortedUser = usersIncomeDetails.sort((a,b) => a.totalIncomeVar > b.totalIncomeVar ? -1 : 1)

    for(let m = 0 ; m < sortedUser.length; m++){

        let data = {
            userreference : sortedUser[m].userreference, 
            activeIncome : sortedUser[m].activeIncomeVar,
            passiveIncome : sortedUser[m].passiveIncomeVar,
            rank : m+1 ,
            updatedAt : new Date(),
        }

        await Rank.findOneAndUpdate({userreference : sortedUser[m].userreference}, data, {upsert: true})
    }

    return sortedUser
}

module.exports = rankUsers;
