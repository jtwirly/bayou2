// Surface user's lesson plan URLs

const { supabase } = require("../lib/supabase");
//import { Outseta } from "outseta-api-client";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const { id, lessonUrl } = req.query;
      const { data, error } = await supabase
        .from("lessonplans")
        .select("*")
        .eq("url", `/${id}`,)
        .single();

      if (error) {
        console.error("Error fetching lesson plan URLs:", error);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (!data) {
        res.status(404).json({ error: "Lesson plan not found" });
      } else {
        const { lessonplanUrls } = data;

      }
    } catch (error) {
      console.error("Error generating lesson plan URLs:", error);
      console.error('Error response:', error.response?.data); // Add this line to inspect the error response
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

