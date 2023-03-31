// Generate quiz based on lesson plan
import { Configuration, OpenAIApi } from "openai";
import { createClient } from "@supabase/supabase-js";

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const supabaseUrl = "https://zcbnbnzqnvdmkopmwpjk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // if (req.method === "GET") {
    try {
      const { id } = req.query;

      const {data}  = await supabaseClient
        .from("lessonplans")
        .select()
        .eq("id", id);

      console.log("data: ", data);

      if (!data || data.length === 0) {
        res.status(404).json({ error: "Lesson plan not found" });
      } else {
        const {
          id,
          lessonplan,
          gradeLevel,
          subject,
          curriculum,
          strand,
          topic,
          expectations,
          duration,
          method,
          framework,
          considerations,
          accommodations,
          mode,
        } = data[0];

        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Create a quiz based on this lesson. For a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. ${lessonplan}`,
          max_tokens: 1024,
          temperature: 0.8,
        });

        const text = completion.data.choices[0].text.trim();
        const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");

        // Save the generated quiz to Supabase
        const { data: updatedData, error: updateError } = await supabaseClient
          .from("lessonplans")
          .update({ quiz: cleanedText })
          .match({ id: id }).select();
        console.log('updatedData ', updatedData);
        if (updateError) {
          console.error("Error updating quiz in the lesson plan:", updateError);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(200).json({ text: cleanedText });
        }
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      console.error("Error response:", error.response?.data);
      res.status(500).json({ error: "Internal Server Error" });
    }
  // } else {
  //   res.setHeader("Allow", ["GET"]);
  //   res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
}
