// Simple health check function
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      message: 'FutureLinked ZA Backend is running!',
      environment: process.env.NODE_ENV || 'production'
    })
  };
};
