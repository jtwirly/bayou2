// Save materials to Supabase and URL, under same record that the lesson plan is in

import { nanoid } from 'nanoid';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zcbnbnzqnvdmkopmwpjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { resources, slideshow, worksheet, quiz, management } = req.body;

    // Save the data to the database
    const saveMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('lessonplans')
        .insert([
          {
            resources: resources,
            slideshow: slideshow,
            worksheet: worksheet,
            quiz: quiz,
            management: management,
          },
        ]);
  
      if (error) {
        throw error;
      }
  
      console.log('Materials saved:', data);
    } catch (error) {
      console.error('Error saving materials:', error.message);
    }
  };
  }
}