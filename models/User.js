const { Schema, Types, model } = require('mongoose');
const validatorPackage = require('validator');

const userSchema = new Schema(
    {
      username:{
        type: String,
        unique: true,
        required: true,
        trim: true
      },
      email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: validatorPackage.isEmail,
            message: 'Please provide a valid email',
          },
      },
      thoughts: [
        {
          type: Schema.Types.ObjectId,
          ref: 'Thought',
        },
      ],
      friends: [
        {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
      ],
    },
    {
      toJSON: {
        getters: true,
        virtuals: true,
      },
    }
  );

  userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
  });

  const User = model('User', userSchema);

module.exports = User;