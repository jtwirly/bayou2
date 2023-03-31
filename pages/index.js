// Generate lesson plan, save it to database, and provide URL to go to lesson plan [id] and generate materials for it (or could do that on this same page)

/* eslint-disable react/no-unknown-property */

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import { nanoid } from 'nanoid';
import { supabase } from './../lib/supabase';

function Home() {  
  const lessonwiseai = []

  const [curriculum, setCurriculum] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [strand, setStrand] = useState('');
  const [topic, setTopic] = useState('');
  const [expectations, setExpectations] = useState('');
  const [duration, setDuration] = useState('');
  const [method, setMethod] = useState('');
  const [framework, setFramework] = useState('');
  const [considerations, setConsiderations] = useState('');
  const [accommodations, setAccommodations] = useState('');
  const [mode, setMode] = useState('');
  const [lessonPlan, setLessonPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    // Submit inputs to the API route and fetch the response
    const res = await fetch(`/api/lesson-plan?curriculum=${curriculum}&gradeLevel=${gradeLevel}&subject=${subject}&strand=${strand}&topic=${topic}&expectations=${expectations}&duration=${duration}&method=${method}&considerations=${considerations}&accommodations=${accommodations}&mode=${mode}`)
    const data = await res.json();
    setLessonPlan(data.text);
    setLoading(false);
    console.log(data);


      // Save the user-generated data to the database
      res = await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify({ curriculum, gradeLevel, subject, strand, topic, expectations, duration, method, framework, considerations, accommodations, mode }),
      });

      if (res.ok) {
        data = await res.json();
        console.log(data);
        setUrl(`/lessonplans${data.url}`); // Update the URL state variable
      } else {
        console.error('Error saving lesson:', res.status);
   };
  }
  
  //React.useEffect(() => {
    //fetchUserPlan();
  //}, []);

  // Need to change the colours of the following to match this: https://www.figma.com/file/WkNWL12EEL1jhoe9OV2eMO/LessonWise?node-id=3-2776&t=cAz44PqiRicdPI9N-0

  return (
    <div className="flex justify-center">
      <Head>
        <title>Lesson Plan Generator</title>
        <meta name="description" content="App that generates lesson plans using OpenAI GPT-3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex pt-40 p-4 flex-col max-w-lg w-full h-screen gap-6">
        <h1 className="text-4xl font-bold text-center">Lesson Plan Generator</h1>
        <h2 className="text-2xl">Create lesson plans for any subject and grade level...</h2>
        <form onSubmit={handleSubmit} className="flex justify-center flex-col gap-5">
          <input
            type="text"
            value={curriculum}
            onChange={(e) => setCurriculum(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Curriculum (e.g. Common Core, Ontario, Texas)"
          />
          <input
            type="text"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Grade Level (e.g. 3rd, 7th, 10th)"
          />
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Subject (e.g. Math, History, Science)"
          />
          <input
            type="text"
            value={strand}
            onChange={(e) => setStrand(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Strand (e.g. Writing, B1.3, Literature Studies and Reading)"
          />
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Topic (e.g. Addition, The Great Depression, The Solar System)"
          />
          <input
            type="text"
            value={expectations}
            onChange={(e) => setExpectations(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Expectations (e.g. compare and order integers, decimal numbers, and fractions, separately and in combination, in various contexts)"
          />
          <input
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Lesson Duration (e.g. 30min, 1h)"
          />
          <input
            type="text"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Pedagogical Method (e.g. inquiry-based, lecture-based)"
          />
          <input
            type="text"
            value={framework}
            onChange={(e) => setFramework(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="(Optional) Enter Framework (e.g. UDL, TfU, Big Idea, Throughline (Questions))"
          />
          <input
            type="text"
            value={considerations}
            onChange={(e) => setConsiderations(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="(Optional) Enter Special Considerations (e.g. gifted, modified, ESL)"
          />
          <input
            type="text"
            value={accommodations}
            onChange={(e) => setAccommodations(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="(Optional) Enter Accommodations (e.g. deaf, ADHD, hard of hearing)"
          />
          <input
            type="text"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="(Optional) Enter Learning Mode (e.g. auditory, visual, kinesthetic, all)"
          />
          <input
            className="self-end bg-violet-800 text-white py-2 px-5 rounded-md hover:bg-violet-700"
            type="submit"
            value="Generate"
          />
        </form>
        {lessonPlan && (
        <>
          <h2>Generated Lesson Plan:</h2>
          <div>
            <p
              dangerouslySetInnerHTML={{
                __html: lessonPlan.replace(/\n/g, '<br />'),
              }}
            ></p>
            <p>
              {`Curriculum: ${curriculum}, Grade level: ${gradeLevel}, Subject: ${subject}, Strand: ${strand}, Topic: ${topic}, Expectations: ${expectations}, Duration: ${duration}, Method: ${method}, Framework: ${framework}, Considerations: ${considerations}, Accommodations: ${accommodations}, Mode: ${mode}, URL: ${url}`}
            </p>
          </div>
        </>
      )}

        <ul>
          {lessonwiseai.map((lessonplans) => (
            <li key={lessonplans.id}>
              <h2>{lessonplans.lessonplans}</h2>
              <p>{lessonplans.response}</p>
              <Link href={lessonplans.url}>Go to Lesson Plan and generate more resources</Link>
            </li>
          ))}
        </ul>
      </div>
  </div>
  );
  }
            
export default Home;
            