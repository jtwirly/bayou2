// Generate lesson plan based on input 

import { Configuration, OpenAIApi } from "openai";
//import { Outseta } from "outseta-api-client";

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const { curriculum, gradeLevel, subject, strand, topic, expectations, duration, method, framework, considerations, accommodations, mode } = req.query;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a lesson plan for a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. Ensure there is differentiation and leveled activities as part of the lesson plan.`,
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

// Ideally now or in future, have it make a formatted printable lesson plan in Google Docs or Google Slides format for this lesson, show it to the user, and save it to the database