let mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let userSchema = new Schema({
    timeJoined: {
        type: Date,
        default: Date.now
    },
    generalInfo: {
        fullName: {
            type: String,
            trim: true,
            required: true
        },
        pictureUrl: String,
    },
    contactInfo: {
        email: {
            type: String,
            trim: true,
            required: true
        },
        linkedinPublicProfileUrl: {
            type: String,
            trim: true
        }
    },
    auth: {
        local: {
            email: {
                type: String,
                trim: true,
                unique: true,
                sparse: true
            },
            password: String,
            resetPassword: {
                token: {
                    type: String,
                    unique: true,
                    sparse: true
                },
                expire: Date
            }
        },
        linkedin: {
            id: {
                type: String,
                unique: true,
                sparse: true
            },
            token: String
        },
        facebook: {
            id: {
                type: String,
                unique: true,
                sparse: true
            },
            token: String
        }
    }
});

// method to return a name where the first letter is in upper case
function upperCaseFirst(s) {
    return s ? s.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
}

// nicely formatted user name
userSchema.virtual('generalInfo.formattedName').get(function () {
    if (!this.generalInfo || !this.generalInfo.fullName) return '';
    return upperCaseFirst(this.generalInfo.fullName);
});

// hash password
userSchema.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking password if is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.auth.local.password);
};

// schema plugins
userSchema.plugin(uniqueValidator);

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);