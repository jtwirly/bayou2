// Save lesson plan to Supabase

import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';

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
  const resp = await supabaseClient
      .from('lessonplans')
      .insert(dataToInsert);

console.log('resp', resp);
const results = await supabaseClient.from('lessonplans').select().eq('id', 1);
      console.log('results', results)

   // if (error) {
   //   throw error;
    //}

    res.status(200).json({results});
  } catch (error) {
    console.error("Error in saveToSupabase:", error);
    res.status(500).json({ error: error.message });
  }
};

export default handler;