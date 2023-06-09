import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabaseUrl = 'https://zcbnbnzqnvdmkopmwpjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

const handler = async (req, res) => {
  try {
    switch (req.method) {
      case 'POST':
        await saveData(req, res);
        break;
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

const saveData = async (req, res) => {
  try {
    const parseBody = JSON.parse(req.body);
    // Extract the necessary data from the request body
    const {
      curriculum,
      gradeLevel,
      subject,
      strand,
      topic,
      expectations,
      duration,
      method,
      framework,
      considerations,
      accommodations,
      mode,
      lessonplan,
    } = parseBody;

    // Save the data to Supabase
    // Set missing fields to empty string
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
      url: `/${nanoid()}`, // Generate a unique URL using nanoid()
    };

    const { data, error } = await supabaseClient.from('lessonplans').insert([dataToInsert]);
    if (error) {
      throw new Error(error.message);
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error in saveData:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

export default handler;
