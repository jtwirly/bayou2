import { nanoid } from 'nanoid';
import { Configuration, OpenAIApi } from "openai";
import { createClient } from '@supabase/supabase-js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const supabaseUrl = 'https://zcbnbnzqnvdmkopmwpjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

const handler = async (req, res) => {
  switch (req.method) {
    case "POST":
      await saveEnergyDataToSupabase(req, res);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const saveEnergyDataToSupabase = async (req, res) => {
  try {
    const parseBody = JSON.parse(req.body);
    const userEmail = parseBody.userEmail;
    const energyData = parseBody.energyData;

    // Generate insights using OpenAI based on the energy data
    const insights = await generateEnergyInsights(energyData);

    // Structure the data for insertion
    const dataToInsert = {
      userEmail: userEmail || '',
      energyData: energyData || {},
      insights: insights,
      url: `/${nanoid()}`, // URL to access this saved data
    };

    console.log('dataToInsert ', dataToInsert)

    // Save to Supabase
    const { data, error } = await supabaseClient
      .from('energyData')
      .insert([dataToInsert]);

    if (error) {
      throw error;
    }

    console.log('data in save', data);
    res.status(200).json({ data });
  } catch (error) {
    console.error("Error in saveEnergyDataToSupabase:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const generateEnergyInsights = async (energyData) => {
  // Construct a prompt to analyze energy data and provide insights
  const prompt = `Analyze the following energy usage data and provide insights and tips on how to improve efficiency:\n\n${JSON.stringify(energyData, null, 2)}`;

  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: 150,
    temperature: 0.7
  });

  return completion.data.choices[0].text.trim();
};

export default handler;
