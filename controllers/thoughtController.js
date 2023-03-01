const { User, Thought } = require('../models');

module.exports={

    getThoughts(req, res) {
        Thought.find()
          .then((thought) => res.json(thought))
          .catch((err) => res.status(500).json(err))
      },
      getSingleThought(req, res) {
        Thought.findOne({ _id: req.params.thoughtId })
          .select('-__v')
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
      createThought(req,res) {
        Thought.create(req.body) 
        .then((thought) => {
            return User.findOneAndUpdate(
                {_id: req.body.userId},
                {$addToSet: {thoughts: thought._id}},
                { new: true}
            );
        })
        .then((user) =>
        !user
            ? res.status(404).json({ 
                message: 'Thought made, but no user found with this id.'})
            : res.json('Thought posted and user found.')
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
          });
        },
      updateThought(req,res) {
        Thought.findOneAndUpdate(
          {_id: req.params.thoughtId},
          {$set: req.body},
          {runValidators: true, new: true}
        )
          .then((thought) =>
            !thought 
              ? res.status(404).json({ message: 'No thought to update with this id.'})
              : res.json(thought)
              )
              .catch((err) =>res.status(500).json(err));
      },
      deleteThought(req, res) {
        Thought.findOneAndDelete({ _id: req.params.thoughtId })
          .then((thought) =>
            !thought
              ? res.status(404).json({ message: 'No thought with that ID' })
              :res.json({ message: 'thought deleted!' })
          )
          .catch((err) => res.status(500).json(err));
      },
      addReaction(req,res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions:req.body}},
            {runValidators: true, new:true}
        )
        .then((thought) => 
        !thought 
          ? res.status(404).json({ message: 'No thought to add reaction to found with that id.' })
          : res.json(thought)
          )
          .catch((err) => res.status(500).json(err));
      },
       deleteReaction({params},res) {
        Thought.findOneAndUpdate(
          {_id: params.thoughtId},
          {$pull: {reactions:params.reactionId }},
          {new: true}
        )
        .select('-__v')
        .populate('reactions')
        .then((thought) => 
        !thought 
          ? res.status(404).json({ message: 'No thought to delete reaction from found with that id.' })
          : res.json({message: 'Reaction deleted!'})
          )
          .catch((err) => res.status(500).json(err));
      }
}