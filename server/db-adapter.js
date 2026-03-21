const Datastore = require('nedb-promises');
const path = require('path');
const bcrypt = require('bcryptjs');

// إعداد مسارات قواعد البيانات المحلية
const dbPath = (name) => path.join(__dirname, `../data/${name}.db`);

const db = {
    users: Datastore.create({ filename: dbPath('users'), autoload: true }),
    products: Datastore.create({ filename: dbPath('products'), autoload: true }),
    orders: Datastore.create({ filename: dbPath('orders'), autoload: true })
};

// محاكي لموديل Mongoose (Mongoose Model Mock)
class NeDBModel {
    constructor(collection) {
        this.collection = collection;
    }

    async find(query = {}) {
        return await this.collection.find(query);
    }

    async findOne(query = {}) {
        const doc = await this.collection.findOne(query);
        if (doc && this.collection === db.users) {
            // إضافة ميثود comparePassword لميقات Mongoose
            doc.comparePassword = async (password) => await bcrypt.compare(password, doc.password);
        }
        return doc;
    }

    async findById(id) {
        return await this.collection.findOne({ _id: id });
    }

    async create(data) {
        if (this.collection === db.users && data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        if (!data.createdAt) data.createdAt = new Date();
        return await this.collection.insert(data);
    }

    async findByIdAndUpdate(id, data, options) {
        await this.collection.update({ _id: id }, { $set: data });
        return await this.findById(id);
    }

    async findByIdAndDelete(id) {
        const doc = await this.findById(id);
        await this.collection.remove({ _id: id });
        return doc;
    }
}

module.exports = {
    User: new NeDBModel(db.users),
    Product: new NeDBModel(db.products),
    Order: new NeDBModel(db.orders),
    isProxy: true
};
