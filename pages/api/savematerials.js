// Save materials to Supabase and URL, under same record that the lesson plan is in

import { nanoid } from 'nanoid';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, resources, slideshow, worksheet, quiz, management } = req.body;

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
