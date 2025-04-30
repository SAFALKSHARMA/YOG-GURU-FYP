// Ownership check middleware
export const checkOwnership = (model) => async (req, res, next) => {
  const doc = await model.findById(req.params.id);

  if (!doc) {
    return res.status(404).json({
      success: false,
      error: "Document not found",
    });
  }

  if (doc.author.toString() !== req.user.id && req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      error: "Not authorized to modify this resource",
    });
  }

  next();
};
