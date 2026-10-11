const hrOnly = (req, res, next) => {
  if (req.user.role !== "HR") {
    return res.status(403).json({ message: "HR access required" });
  }

  next();
};

module.exports = hrOnly;