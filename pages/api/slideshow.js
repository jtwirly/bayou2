// Generate quiz based on lesson plan

const { Configuration, OpenAIApi } = require("openai");
const { supabase } = require("../lib/supabase");

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id, lessonPlan, gradeLevel, subject, curriculum, strand, topic, expectations, duration, method, framework, considerations, accommodations, mode } = req.query;
      const { data, error } = await supabase
        .from("lessonplans")
        .select("*")
        .eq("url", `/${id}`)
        .single();

      if (error) {
        console.error("Error fetching lesson plan data:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (!data) {
        res.status(404).json({ error: "Lesson plan not found" });
      } else {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Create an outline for a PowerPoint presentation based on this ${lessonPlan}, for a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}`,
          max_tokens: 1024,
          temperature: 0.8,
        });

        const text = completion.data.choices[0].text.trim();
        const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");

        res.status(200).json({ text: cleanedText });
      }
    } catch (error) {
      console.error("Error generating PowerPoint outline:", error);
      console.error('Error response:', error.response?.data);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}


// Ideally now or in future, have it make a presentable slide deck in Google Slides format (ideally with colours and perhaps images) for this lesson, show it to the user, and save it to the database