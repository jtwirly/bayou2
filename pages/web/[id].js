// Show the keyed in lesson plan parameters and generated lesson plan, and generate materials (resources, slideshow, worksheet, and quiz) based on the lesson plan, show them to the user, and save them to Supabase and URL alongside the lesson plan

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function LessonPlans() {
  const router = useRouter();
  const { id } = router.query;
  const [lessonplanData, setLessonplanData] = useState(null);
  const [resources, setResources] = useState(null);
  const [slideshow, setSlideshow] = useState(null);
  const [worksheet, setWorksheet] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [management, setManagement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lessonPlansData, setLessonPlansData] = useState([]); // Define the lessonPlansData state

  useEffect(() => {
    if (id) {
      fetchLessonplanData(id);
    }
  }, [id]);

  const fetchLessonplanData = async (url) => {
    const { data, error } = await supabase.from('lessonplans').select('*').eq('url', `/${id}`).single();
    if (error) {
      console.error('Error fetching lesson plan data:', error.message);
    } else {
      setLessonplanData(data);
    }
  };

  const handleSubmit = async (event) => {
    setLoading(true);
    event.preventDefault();
    try {
      const resResources = await fetch(`/api/resources?id=${id}&lessonplan=${lessonplanData.lessonplan}`);
      const resSlideshow = await fetch(`/api/slideshow?id=${id}&lessonplan=${lessonplanData.lessonplan}`);
      const resWorksheet = await fetch(`/api/worksheet?id=${id}&lessonplan=${lessonplanData.lessonplan}`);
      const resQuiz = await fetch(`/api/quiz?id=${id}&lessonplan=${lessonplanData.lessonplan}`);
      const resManagement = await fetch(`/api/quiz?id=${id}&lessonplan=${lessonplanData.lessonplan}`);

      setResources(await resResources.json());
      setSlideshow(await resSlideshow.json());
      setWorksheet(await resWorksheet.json());
      setQuiz(await resQuiz.json());
      setManagement(await resManagement.json());

      // Save the user-generated data to the database
      const resSaveMaterials = await fetch(`/api/savematerials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resources, slideshow, worksheet, quiz, management }),
      });

      if (!resSaveMaterials.ok) {
        throw new Error('Error saving materials');
      }

    } catch (error) {
      console.error('Error generating materials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!lessonplanData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <p>{lessonplanData.lessonplan}</p>
      <button onClick={handleSubmit} disabled={loading}>
        Generate Materials for Lesson Plan
      </button>
      {resources && (
        <div>
          <strong>Resources:</strong>
          <p>{resources.text}</p>
        </div>
      )}
      {slideshow && (
        <div>
          <strong>Slideshow:</strong>
          <p>{slideshow.text}</p>
        </div>
      )}
      {worksheet && (
        <div>
          <strong>Worksheet:</strong>
          <p>{worksheet.text}</p>
        </div>
      )}
      {quiz && (
        <div>
          <strong>Quiz:</strong>
          <p>{quiz.text}</p>
        </div>
      )}
      {management && (
        <div>
          <strong>Classroom Management Tips for Lesson:</strong>
          <p>{management.text}</p>
        </div>
      )}
  
  <ul>
        {lessonPlansData.map((lessonplans) => (
          <li key={lessonplans.id}>
            <h2>{lessonplans.lessonplans}</h2>
            <p>{lessonplans.response}</p>
            <Link href={lessonplans.url}>
              <a>Save materials</a>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
        }