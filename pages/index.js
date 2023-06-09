// Generate lesson plan, save it to database, and provide URL to go to lesson plan [id] and generate materials for it (or could do that on this same page)
// Add learning style

/* eslint-disable react/no-unknown-property */

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';
import { nanoid } from 'nanoid';
import { supabase } from './../lib/supabase';
import axios from "axios";

function Home() {
  const lessonwiseai = [];
  const [lessonPlanId, setLessonPlanId] = useState(null);
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
  const [lessonplan, setLessonplan] = useState('');
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState(null);
  const [resources, setResources] = useState(null);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [slideshow, setSlideshow] = useState(null);
  const [slideshowLoading, setSlideshowLoading] = useState(false);
  const [worksheet, setWorksheet] = useState(null);
  const [worksheetLoading, setWorksheetLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [quizLoading, setQuizLoading] = useState(false);
  const [management, setManagement] = useState(null);
  const [managementLoading, setManagementLoading] = useState(false);

  //function ResourcesForm() {
    //const [lessonplan, setLessonplan] = useState("");
    //const [resources, setResources] = useState("");

  // ...

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    console.log(`Submitting request with input: Create a lesson plan for a grade ${gradeLevel} ${subject} class following the ${curriculum} curriculum, focusing on the strand of ${strand}, the topic of ${topic} and the expectations of ${expectations}, with a duration of ${duration}, using the ${method} pedagogical method, the ${framework} framework, and the ${mode} learning mode, taking into account considerations for ${considerations} and accommodation for ${accommodations}. Ensure there is differentiation and leveled activities as part of the lesson plan.`);

    try {
      // Step 1: Generate the lesson plan
      const lessonPlanResponse = await fetch('/api/lesson-plan', {
        method: 'POST', // Send a POST request
        body: JSON.stringify({
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
        }),
      });

      if (lessonPlanResponse.ok) {
        const { text } = await lessonPlanResponse.json();

        // Step 2: Display the generated lesson plan
        setLessonplan(text);

        // Step 3: Save the data
        const saveResponse = await fetch('/api/save', {
          method: 'POST',
          body: JSON.stringify({
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
            lessonplan: text, // Save the generated lesson plan
          }),
        });

        if (saveResponse.ok) {
          const { success, data } = await saveResponse.json();
          if (success) {
            // Data saved successfully
            setUrl(data[0].url); // Set the generated URL
            setLessonPlanId(data[0].id); // Store the id
          } else {
            console.error('Failed to save the data');
          }
        } else {
          console.error(`Error saving data: ${saveResponse.status}`);
          console.log('Saving data...');
          console.log('Save response:', saveResponse);
          console.log('Lesson plan ID:', data[0].id);
        }
      } else {
        console.error(`Error generating lesson plan: ${lessonPlanResponse.status}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      setLoading(false);
    }
  };

      // Generate resources
      //const generateResources = async () => {
        //try {
          //const response = await axios.post('/api/resources', { lessonplan });
          //setResources(response.data.resources);
        //} catch (error) {
          //console.error("Error generating resources:", error);
        //}
      //};}

    const generateResources = async (e) => {
      setResourcesLoading(true);
      console.log('generateresources');
      const res = await fetch(`/api/resources?id=${record.id}`);
      const data = await res.json();
  
      setResources(data.text);
      setResourcesLoading(false);
      console.log(resources);
    };

  const generateSlideshow = async (e) => {
    setSlideshowLoading(true);
    console.log('generateslideshow');
    const res = await fetch(`/api/slideshow?id=${record.id}`);
    const data = await res.json();

    setSlideshow(data.text);
    setSlideshowLoading(false);
    console.log(resources);
  };

  const generateWorksheet = async (e) => {
    setWorksheetLoading(true);
    console.log('generateworksheet');
    const res = await fetch(`/api/worksheet?id=${record.id}`);
    const data = await res.json();

    setWorksheet(data.text);
    setWorksheetLoading(false);
    console.log(resources);
  };

  const generateQuiz = async (e) => {
    setQuizLoading(true);
    console.log('generatequiz');
    const res = await fetch(`/api/quiz?id=${record.id}`);
    const data = await res.json();

    setQuiz(data.text);
    setQuizLoading(false);
    console.log(quiz);
  };

  const generateManagement = async (e) => {
    setManagementLoading(true);
    console.log('generatemanagement');
    const res = await fetch(`/api/management?id=${record.id}`);
    const data = await res.json();

    setManagement(data.text);
    setManagementLoading(false);
    console.log(management);
  };

  return (
    <div className="flex justify-center">
      <Head>
        <title>Lesson Plan & Resource Generator</title>
        <meta name="description" content="App that generates lesson plans using OpenAI GPT-3" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex pt-40 p-4 flex-col max-w-lg w-full h-screen gap-6">
        <h1 className="text-4xl font-bold text-center">Lesson Plan & Resource Generator</h1>
        <h2 className="text-2xl">Generate lesson plans and resources for any subject and grade level...</h2>
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
            placeholder="(Optional) Enter Learning Mode (e.g. in-person, hybrid, online)"
          />
          <input
            className="self-end bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700"
            type="submit"
            value="Generate"
          />
        </form>
        <p>Please ensure to save your work by copying and pasting it to something like a Google Doc or Word Doc. We will have a saving function coming soon.</p>
        {loading && <div>Loading...</div>}
        {lessonplan && (
          <>
            <h2>Generated Lesson Plan:</h2>
            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html: lessonplan.replace(/\n/g, '<br />'),
                }}
              ></p>
            </div>
            <div>
              <p>
                {`Curriculum: ${curriculum}, Grade level: ${gradeLevel}, Subject: ${subject}, Strand: ${strand}, Topic: ${topic}, Expectations: ${expectations}, Duration: ${duration}, Method: ${method}, Framework: ${framework}, Considerations: ${considerations}, Accommodations: ${accommodations}, Mode: ${mode}`}
              </p>
            </div>
            <div>
              <textarea
                value={lessonplan}
                onChange={e => setLessonplan(e.target.value)}
              />
              <button onClick={generateResources}>Generate Resources</button>
              <h2>Generated Resources:</h2>
              <p>{resources}</p>
            </div>
            <div>
              <button onClick={generateSlideshow} className="self-end bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700">Generate Slideshow Outline *Beta*</button>
              {slideshowLoading && <div>Loading...</div>}
              {slideshow && (
                <div>
                  <p style={{ marginBottom: "20px" }}>Note this is a beta feature. Coming soon: enhanced slideshow outlines and possible slideshow generation. In the meantime, if you want to generate a slideshow with visuals for this lesson plan, you can use a software like <a href="https://gamma.app" target="_blank" rel="noreferrer">https://gamma.app</a>, select their AI tool, copy this presentation outline or the lesson plan in, and it will generate a presentation for you.</p>
                  <h2>Generated Slideshow Outline *Beta*:</h2>
                  <p> </p>
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: slideshow.replace(/\n/g, '<br />'),
                      }}
                    ></p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <button onClick={generateWorksheet} className="self-end bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700">Generate Worksheet Outline</button>
              {worksheetLoading && <div>Loading...</div>}
              {worksheet && (
                <div>
                  <h2>Generated Worksheet:</h2>
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: worksheet.replace(/\n/g, '<br />'),
                      }}
                    ></p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <button onClick={generateQuiz} className="self-end bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700">Generate Quiz</button>
              {quizLoading && <div>Loading...</div>}
              {quiz && (
                <div>
                  <h2>Generated Quiz:</h2>
                  <div>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: quiz.replace(/\n/g, '<br />'),
                      }}
                    ></p>
                  </div>
                </div>
              )}
            </div>
            <div>
              <button onClick={generateManagement} className="self-end bg-black text-white py-2 px-5 rounded-md hover:bg-gray-700">Generate Classroom Management Tip</button>
              {managementLoading && <div>Loading...</div>}
              {management && (
                <div>
                  <h2>Generated Classroom Management Tip:</h2>
                  <div>
                    <p>{management}</p>
                  </div>
                </div>
              )}
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
