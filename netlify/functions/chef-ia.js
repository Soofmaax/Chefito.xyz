exports.handler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      answer: 'The AI assistant is disabled in this demo.'
    })
  };
};
