import { Configuration, OpenAIApi } from "openai";
//import { Outseta } from "outseta-api-client";

// Setup OpenAI
const openaiConfiguration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(openaiConfiguration);

// Setup Outseta
//const outseta = new Outseta({
//  apiKey: process.env.OUTSETA_API_KEY,
//});

const handler = async (req, res) => {
  switch (req.method) {
    case "GET":
      await getLessonPlan(req, res);
      break;
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getLessonPlan = async (req, res) => {
  try {
    const { curriculum, gradeLevel, subject, strand, topic, duration, method, framework } = req.query;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a lesson plan for a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand} and the topic of ${topic}, with a duration of ${duration}, using the ${method} pedagogical method and the ${framework} framework.`,
      max_tokens: 1024,
      temperature: 0.8
    });

    const lessonPlan = completion.data.choices[0].text.trim();

    // Decrement quota used by the user for generating a lesson plan
    //const userId = req.headers["x-user-id"]; // Get the user ID from the request headers
    //const subscription = await outseta.subscriptions.getByUser(userId);
    //const userPlan = subscription.subscriptions[0]; // Assuming there is only one subscription per user
    //userPlan.quotaUsed++;
    //await outseta.subscriptions.update(userPlan.uid, { quotaUsed: userPlan.quotaUsed });

    res.status(200).json({ text: lessonPlan });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export default handler;
