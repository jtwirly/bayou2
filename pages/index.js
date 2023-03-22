/* eslint-disable react/no-unknown-property */

import Head from 'next/head';
import { useState } from 'react';

const Home = () => {
  const [input, setInput] = useState('');
  const [birthday, setBirthday] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    const timeOfDay = getTimeOfDay();
    const res = await fetch(`/api/advice?prompt=${input}&birthday=${birthday}&timeOfDay=${timeOfDay}`);
    const data = await res.json();
    setAnswer(data.text);
    setLoading(false);
  };

  const getTimeOfDay = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return "morning";
  } else if (currentHour >= 12 && currentHour < 18) {
    return "afternoon";
  } else if (currentHour >= 18 && currentHour < 22) {
    return "evening";
  } else {
    return "late at night";
  }
};

  return (
    <div className="flex justify-center">
    <Head>
      <title>Fortune Teller</title>
      <meta name="description" content="App that tells your fortune using OpenAI GPT-3" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className="flex pt-40 p-4 flex-col max-w-lg w-full h-screen gap-6">
      <h1 className="text-4xl font-bold text-center">Magic 8</h1>
      <h2 className="text-2xl">Seek answers to your questions, big or small...</h2>
        <form onSubmit={handleSubmit} className="flex justify-center flex-col gap-5">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl text-xl"
            placeholder="Type your question - Love? Money? Purpose?"
          />
          <p className="text-xl">Date of Birth:</p>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="border-2 border-violet-800 py-3 px-5 rounded-xl"
          />
          <input className="self-end bg-violet-800 text-white py-2 px-5 rounded-md hover:bg-violet-700" type="submit" value="Ask" />
        </form>
        {loading && <div>Loading...</div>}
        {answer && (
          <>
            <h2>Answer:</h2>
            <div>{answer}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
