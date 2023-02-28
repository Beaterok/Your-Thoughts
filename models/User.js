const { Schema, Types, model } = require('mongoose');

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
        match: [ //regex to validate email is an email within site parameters
      /^([\w]+)@([\w]+)\.([a-zA-Z]{2,9})$/,
      'Email does not meet our requirements.',
    ],
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