import { Configuration, OpenAIApi } from "openai";

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { lessonplan } = JSON.parse(req.body);

      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: `Provide resources for this lesson plan: ${lessonplan}`,
        max_tokens: 1024,
        temperature: 0.8,
      });

      const text = completion.data.choices[0].text.trim();
      const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");

      res.status(200).json({ resources: cleanedText });
    } catch (error) {
      console.error("Error generating resources:", error);
      console.error("Error response:", error.response?.data);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ status: 'Fail', message: 'Method not allowed' });
  }
}
