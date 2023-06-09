// Generate lesson plan based on input 

import { Configuration, OpenAIApi } from "openai";
//import { Outseta } from "outseta-api-client";
import { createClient } from '@supabase/supabase-js';
import retry from 'async-retry'; // Import the retry function

// Setup OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const supabaseUrl = 'https://zcbnbnzqnvdmkopmwpjk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)


// Setup Outseta
//const outseta = new Outseta({
//  apiKey: process.env.OUTSETA_API_KEY,
//});

const handler = async (req, res) => {
  // switch (req.method) {
  //   case "POST":
  //     await getLessonplan(req, res);
  //     break;
  //   default:
  //     res.setHeader("Allow", ["POST"]);
  //     res.status(405).end(`Method ${req.method} Not Allowed`);
  // }
  await getLessonplan(req, res);
};

const getLessonplan = async (req, res) => {
  try {
    const { curriculum, gradeLevel, subject, strand, topic, expectations, duration, method, framework, considerations, accommodations, mode, id } = req.query;
    const completion = await retry(async bail => {
      try {
        // if anything throws, we retry
        const result = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `Create a lesson plan for a ${gradeLevel} grade ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. Ensure there is differentiation and leveled activities as part of the lesson plan.`,
          max_tokens: 1024,
          temperature: 0.8
        });
        return result;
      } catch (err) {
        const statusCode = err?.response?.status;
        if (statusCode === 429 || statusCode === 503) {
            // If status is 429 or 503, re-throw the error to trigger a retry
            throw err;
        }
        // If it's a different error, bail out and don't retry
        bail(err);
      }  
    }, {
      retries: 5,
      factor: 2, // exponential factor
      minTimeout: 1 * 1000, // the number of milliseconds before starting the first retry
      onRetry: (error) => console.log(error), // log each error to understand what's happening if it fails
    });

    const text = completion.data.choices[0].text.trim();
    const cleanedText = text.replace(/^[.,\s]+|[.,\s]+$/g, "");
    console.log('cleaned text: ', cleanedText);
    const {data} = await supabaseClient
      .from("lessonplans")
      .update({ lessonplan: cleanedText})
      .match({ id: id }).select();
    console.log('lesson plan data: ', data);

    // Decrement quota used by the user for generating a lesson plan
    //const userId = req.headers["x-user-id"]; // Get the user ID from the request headers
    //const subscription = await outseta.subscriptions.getByUser(userId);
    //const userPlan = subscription.subscriptions[0]; // Assuming there is only one subscription per user
    //userPlan.quotaUsed++;
    //await outseta.subscriptions.update(userPlan.uid, { quotaUsed: userPlan.quotaUsed });

    res.status(200).json({ text: cleanedText });
  } catch (error) {
    if (error.response) {
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export default handler;

// Ideally now or in future, have it make a formatted printable lesson plan in Google Docs or Google Slides format for this lesson, show it to the user, and save it to the database