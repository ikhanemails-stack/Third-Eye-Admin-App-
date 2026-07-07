// Third Eye Computer Solutions - License Manager
// Shared helpers.

function requireLogin(req, res, next) {
  if (req.session && req.session.adminId) return next();
  return res.status(401).json({ error: 'Not logged in.' });
}

module.exports = { requireLogin };
