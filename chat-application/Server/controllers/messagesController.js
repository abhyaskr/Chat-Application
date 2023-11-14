const messageModel = require("../model/messageModel");

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      return res.status(400).json({ msg: "Invalid input data" });
    }

    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    return res.status(200).json({ msg: "Message added successfully" });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

module.exports.getAllMessage = async (req, res, next) => {
    try {
      const { from, to } = req.query; // Use req.query instead of req.body
      const messages = await messageModel.find({
        users: {
          $all: [from, to],
        },
      }).sort({ updatedAt: 1 });
  
      const projectedMessages = messages.map((msg) => {
        return {
          fromSelf: msg.sender.toString() === from,
          message: msg.message.text,
        };
      });
  
      res.status(200).json(projectedMessages);
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
  
