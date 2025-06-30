exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
      message: 'Payments are disabled in this demo.'
    })
  };
};
