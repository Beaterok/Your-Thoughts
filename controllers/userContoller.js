const { User, Thought } =  require('../models');

module.exports = {
getUsers(req,res) {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(500).json(err));
},
getSingleUser(req,res) {
  User.findOne({_id: req.params.userId})
  .select('-__v')
  .then((user) =>
    !user 
      ? res.status(404).json({message: 'No user found with this id.'})
      : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
createUser(req,res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
updateUser(req,res) {
  User.findOneAndUpdate(
    {_id: req.params.userId},
    {$set: req.body},
    {runValidators: true, new: true}
  )
    .then((user) =>
      !user 
        ? res.status(404).json({ message: 'No user to update with this id.'})
        : res.json(user)
        )
        .catch((err) =>res.status(500).json(err));
},
deleteUserAndThoughts(req, res) {
  User.findOneAndDelete({ _id: req.params.userId })
  .then((user) =>
  !user
    ? res.status(404).json({message: 'No user found with that id.'})
    : Thought.deleteMany({_id: {$in: user.thoughts}})
  )
  .then(() => res.json({ message: "User and user's thoughts deleted!"}))
  .catch((err) => res.status(500).json(err));
},
addFriend({params},res) {
  User.findOneAndUpdate(
    {_id: params.userId},
    {$addToSet: {friends:params.friendId }},
    {new: true}
  )
  .select('-__v')
  .populate('friends')
  .then((user) => 
  !user 
    ? res.status(404).json({ message: 'No user to add friend to found with that id.' })
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
deleteFriend({params},res) {
  User.findOneAndUpdate(
    {_id: params.userId},
    {$pull: {friends:params.friendId }},
    {runValidators: true, new: true}
  )
  .select('-__v')
  .populate('friends')
  .then((user) => 
  !user 
    ? res.status(404).json({ message: 'No user to delete friend from found with that id.' })
    : res.json(user)
    )
    .catch((err) => res.status(500).json(err));
},
deleteUser(req, res) {
  User.findOneAndDelete({ _id: req.params.userId })
    .then((user) =>
      !user
        ? res.status(404).json({ message: 'No user with that ID' })
        : res.json(user)
    )
    .then(() => res.json({ message: 'user deleted!' }))
    .catch((err) => res.status(500).json(err));
},
};