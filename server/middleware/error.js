export function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);
  let status = err.status || 500;
  let message = err.message || 'Something went wrong.';

  if (err.name === 'ValidationError') {
    status = 400;
    message = Object.values(err.errors).map((e) => e.message).join(' ');
  }
  if (err.code === 11000) {
    status = 409;
    message = `That ${Object.keys(err.keyPattern)[0]} is already registered.`;
  }
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID.';
  }
  res.status(status).json({ message });
}
