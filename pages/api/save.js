// Save lesson plan to Supabase

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
      await saveToSupabase(req, res);
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

const saveToSupabase = async (req, res) => {
  try {
    const parseBody = JSON.parse(req.body);
    const curriculum = parseBody.curriculum;
    const gradeLevel = parseBody.gradeLevel;
    const subject = parseBody.subject;
    const strand = parseBody.strand;
    const topic = parseBody.topic;
    const expectations = parseBody.expectations;
    const duration = parseBody.duration;
    const method = parseBody.method;
    const framework = parseBody.framework;
    const considerations = parseBody.considerations;
    const accommodations = parseBody.accommodations;
    const mode = parseBody.mode;
    const lessonplan = parseBody.lessonplan;

    // Set missing fields to null
    const dataToInsert = {
      curriculum: curriculum || '',
      gradeLevel: gradeLevel || '',
      subject: subject || '',
      strand: strand || '',
      topic: topic || '',
      expectations: expectations || '',
      duration: duration || '',
      method: method || '',
      framework: framework || '',
      considerations: considerations || '',
      accommodations: accommodations || '',
      mode: mode || '',
      lessonplan: lessonplan || '',
      resources: mode || '',
      slideshow: mode || '',
      worksheet: mode || '',
      quiz: mode || '',
      management: mode || '',
      url: `/${nanoid()}`,
    };

    console.log('dataToInsert ', dataToInsert)
     const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Create a lesson plan for a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. Ensure there is differentiation and leveled activities as part of the lesson plan.`,
      max_tokens: 1024,
      temperature: 0.8
    });
    console.log('completion', completion.data);

    const text = completion.data.choices[0].text.trim();
    console.log('text', text)
    const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");
    console.log('cleaned text: ', cleanedText);
    dataToInsert.lessonplan = cleanedText;
  const {data} = await supabaseClient
      .from('lessonplans')
      .insert(dataToInsert).select();

console.log('data in save', data);

   // if (error) {
   //   throw error;
    //}

    res.status(200).json({data});
    console.log('returning')
  } catch (error) {
    console.error("Error in saveToSupabase:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;