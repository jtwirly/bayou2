// Save resources to Supabase
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zcbnbnzqnvdmkopmwpjk.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      await saveData(req, res);
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: "An unexpected error occurred." });
  }
}

const saveData = async (req, res) => {
  try {
    const { url } = req.query;

    const { data } = await supabaseClient
      .from("lessonplans")
      .select()
      .eq("url", url);

    if (!data || data.length === 0) {
      res.status(404).json({ error: "Lesson plan not found" });
    } else {
      const { resources } = JSON.parse(req.body);

      // Save the generated resources to Supabase
      const { data: updatedData, error: updateError } = await supabaseClient
        .from("lessonplans")
        .update({ resources })
        .match({ url });

      if (updateError) {
        console.error("Error updating resources in the lesson plan:", updateError);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ success: true });
      }
    }
  } catch (error) {
    console.error("Error response:", error.response?.data);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
