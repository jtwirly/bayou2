const { Configuration, OpenAIApi } = require("openai");

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
    const { subject, gradeLevel, duration } = req.query;
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a lesson plan for a ${gradeLevel} grade ${subject} class with a duration of ${duration}.`,
      max_tokens: 3500,
      temperature: 0.8
    });

    const lessonPlan = completion.data.choices[0].text.trim();

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

