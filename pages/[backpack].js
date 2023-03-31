// Show a user a list of their lesson plan pages (which will also contain their materials) with clickable URLs to each 

import { Configuration, OpenAIApi } from "openai";

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      await getLessonPlan(req, res);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const getLessonPlan = async (req, res) => {
  try {
    const { id, curriculum, gradeLevel, subject, strand, topic, expectations, duration, method, framework, considerations, accommodations, mode } = req.query;

    let response;
    try {
      response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a lesson plan for a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. Ensure there is differentiation and leveled activities as part of the lesson plan.`,
        max_tokens: 1024,
        temperature: 0.8,
      });
    } catch (error) {
      console.error("Error in OpenAI API call:", error.message);
      return res.status(500).send(error.message);
    }

    const lessonPlan = response.data.choices[0].text.trim();

    // In the future, implement generating a formatted printable lesson plan in Google Docs or Google Slides format for this lesson, show it to the user, and save it to the database.

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
