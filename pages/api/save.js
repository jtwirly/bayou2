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
    const curriculum = req.body.get('curriculum');
    const gradeLevel = req.body.get('gradeLevel');
    const subject = req.body.get('subject');
    const strand = req.body.get('strand');
    const topic = req.body.get('topic');
    const expectations = req.body.get('expectations');
    const duration = req.body.get('duration');
    const method = req.body.get('method');
    const framework = req.body.get('framework');
    const considerations = req.body.get('considerations');
    const accommodations = req.body.get('accommodations');
    const mode = req.body.get('mode');

    // Set missing fields to null
    const dataToInsert = {
      curriculum: curriculum || null,
      gradeLevel: gradeLevel || null,
      subject: subject || null,
      strand: strand || null,
      topic: topic || null,
      expectations: expectations || null,
      duration: duration || null,
      method: method || null,
      framework: framework || null,
      considerations: considerations || null,
      accommodations: accommodations || null,
      mode: mode || null,
      url: `/${nanoid()}`,
    };

    const { data, error } = await supabaseClient
      .from('lessonplans')
      .insert([dataToInsert]);

    if (error) {
      throw error;
    }

    res.status(200).json(data[0]);
  } catch (error) {
    console.error("Error in saveToSupabase:", error);
    res.status(500).json({ error: error.message });
  }
};