/* eslint-disable react/no-unknown-property */

import Head from 'next/head';
import { useState } from 'react';
import React from 'react';

const Home = () => {
  const [curriculum, setCurriculum] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('');
  const [method, setMethod] = useState('');
  const [lessonPlan, setLessonPlan] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const res = await fetch(`/api/lesson-plan?curriculum=${curriculum}&gradeLevel=${gradeLevel}&subject=${subject}&topic=${topic}&duration=${duration}&method=${method}`);
    const data = await res.json();
    setLessonPlan(data.text);
    setLoading(false);
  };

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
            placeholder="Enter Curriculum (e.g. Ontario, Alberta, BC, USA)"
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
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Enter Topic (e.g. Adding, The Great Depression, The Solar System)"
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
            className="self-end bg-violet-800 text-white py-2 px-5 rounded-md hover:bg-violet-700"
            type="submit"
            value="Generate"
          />
        </form>
        {loading && <div>Loading...</div>}
        {lessonPlan && (
          <>
            <h2>Generated Lesson Plan:</h2>
            <div>
              <p
                dangerouslySetInnerHTML={{
                  __html: lessonPlan.replace(/\n/g, '<br />'),
                }}
              ></p>
            </div>
          </>
        )}
      </div>
  </div>
);
        }

export default Home;