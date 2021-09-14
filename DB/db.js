const faker = require("faker");

const db = {
    getNews: function () {
        const newdata = [];
        for (let i = 0; i < 3; i++) {
            newdata.push(createNews());
        }
        return newdata;
    }
}


function createNews() {
    return {
        description: faker.lorem.sentence(),
        date: Date.now(),
    }
}

module.exports = {
    db,
}