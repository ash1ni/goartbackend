const UserLog = require('../models/userLogModel');

// Create a new user log
exports.createUserLog = async (req, res) => {
  try {
    const { user_id, module, action, details } = req.body;

    const newUserLog = {
      user_id,
      module,
      action,
      details,
    };

    const createdUserLog = await UserLog.create(newUserLog);

    res.json(createdUserLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all user logs
exports.getAllUserLogs = async (req, res) => {
  try {
    const allUserLogs = await UserLog.getAll();

    res.json(allUserLogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a specific user log by ID
exports.getUserLogById = async (req, res) => {
  try {
    const { id } = req.params;

    const userLog = await UserLog.getById(id);

    if (!userLog) {
      return res.status(404).json({ error: 'User log not found' });
    }

    res.json(userLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
