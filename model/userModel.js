const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema (
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        message: {},
        addAt: { type: Date, default: Date.now },
        email: { type: String, unique: true, required: true },
    }
)

UserSchema.pre('save', function(next) {
    if (this.isModified('password') || this.isNew()) {
        this.password = bcrypt.hashSync(this.password, 12);
    }
    next();
})

module.exports = mongoose.model("User", UserSchema);