const dialogflow = require('dialogflow');

function getSession() {
  const config = {
    credentials: {
      private_key: process.env.DIALOGFLOW_PRIVATE_KEY,
      client_email: process.env.DIALOGFLOW_CLIENT_EMAIL
    }
  };

  return new dialogflow.SessionsClient(config);
}

async function detectIntent(
  projectId,
  sessionId,
  query,
  contexts,
  languageCode
) {
  const sessionClient = getSession();
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.sessionPath(projectId, sessionId);

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  };

  if (contexts && contexts.length > 0) {
    request.queryParams = {
      contexts: contexts
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

async function executeQuery(
  projectId,
  sessionId,
  query,
  context,
  languageCode
) {
  let intentResponse;

  try {
    console.log(`Sending Query: ${query}`);
    intentResponse = await detectIntent(
      projectId,
      sessionId,
      query,
      context,
      languageCode
    );
    console.log('Detected intent');
    console.log(
      `Fulfillment Text: ${intentResponse.queryResult.fulfillmentText}`
    );
    return intentResponse;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  detectIntent: async (req, res, next) => {
    const { projectId, sessionId, query, context, languageCode } = req.body;

    if (!projectId || !sessionId || !query || !languageCode) {
      return res.status(400).send({
        message:
          'Your request body must include the projectId, sessionId, query, context, and language code variables'
      });
    }

    const intentResponse = await executeQuery(
      projectId,
      sessionId,
      query,
      context,
      languageCode
    );

    res.status(200).json(intentResponse);
  }
};
