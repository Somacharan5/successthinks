const { isEqual, isAfter } = require("date-fns");

// changes effective from 15 september 2022
const septCommissonChangesDate = new Date(new Date('2022-09-15').toDateString());
// this time structure uses UTC time, so by default all times are pushed back by 5:30 hours. as indian hours are 5:30 ahead of utc.

// active income structure
const calculateActiveCommission = (products, createdAt, userProducts) => {
    let commission = 0;
    let newCommissionStructure = false;
    newCommissionStructure = isEqual(new Date(new Date(createdAt).toDateString()), septCommissonChangesDate);
    newCommissionStructure = isAfter(new Date(new Date(createdAt).toDateString()), septCommissonChangesDate);

    // old commission structure
    if (newCommissionStructure === false) {
        commission = products?.includes("1") ? "3000" : "1600";
        return commission;
    }

    // new commission structure for users with products including 1 type of product
    if (userProducts.includes("1")) {
        commission = products?.includes("1") ? "3000" : "1600";
        return commission;
    }

    // new commission structure for users with products including 2 type of product
    if (userProducts.includes("2")) {
        commission = products?.includes("1") ? "2200" : "1200";
        return commission;
    }

    return 0;

}

// passive income structure
const calculatePassiveCommission = (products, createdAt, userProducts) => {
    let commission = 0;
    let newCommissionStructure = false;
    newCommissionStructure = isEqual(new Date(new Date(createdAt).toDateString()), septCommissonChangesDate);
    newCommissionStructure = isAfter(new Date(new Date(createdAt).toDateString()), septCommissonChangesDate);

    // old commission structure
    if (newCommissionStructure === false) {
        commission = products?.includes("1") ? "500" : "150";
        return commission;
    }


    // new commission structure for users with products including 1 type of product
    if (userProducts.includes("1")) {
        commission = products?.includes("1") ? "500" : "200";
        return commission;
    }

    // new commission structure for users with products including 2 type of product
    if (userProducts.includes("2")) {
        commission = products?.includes("1") ? "250" : "80";
        return commission;
    }

    return 0;

}

module.exports = { calculateActiveCommission, calculatePassiveCommission }