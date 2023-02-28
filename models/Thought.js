const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
      thoughtText:{
        type: String,
        required: true,
        min: 1,
        max: 280
      },
      createdAt: {
        type: Date,
        default: Date.now,
        get: (date) => timeSince(date),
      },
      username: {
        type: String,
        required: true,
      },
      reactions: [ reactionSchema]
      
    },
    {
      toJSON: {
        getters: true,
        virtuals: true,
      },
    }
  );

  thoughtSchema.virtual('rectionCount').get(function () {
    return this.reactions.length;
  });
  const Thought = model('Thought', thoughtSchema);

  module.exports = Thought;