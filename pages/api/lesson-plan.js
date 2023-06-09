import { Configuration, OpenAIApi } from "openai";
import retry from 'async-retry';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const generateLessonPlan = async (req, res) => {
  try {
    const { curriculum, gradeLevel, subject, strand, topic, expectations, duration, method, framework, mode, considerations, accommodations } = req.body;

    // Generate the lesson plan using OpenAI GPT-3
    const completion = await retry(async () => {
      const result = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Create a lesson plan for a grade ${gradeLevel} ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. Ensure there is differentiation and leveled activities as part of the lesson plan.`,
        max_tokens: 1024,
        temperature: 0.8
      });
      return result;
    }, {
      retries: 3,
      minTimeout: 1000, // 1 second
      factor: 2, // exponential factor
      randomize: true, // randomizes the timeouts by a factor of two (exponential backoff)
    });

    // Clean up the text output
    const text = completion.data.choices[0].text.trim();
    const lessonplan = text.replace(/^[.,\s]+|[.,\s]+$/g, '');

    res.status(200).json({ text: lessonplan });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
}

const handler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      await generateLessonPlan(req, res);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export default handler;
