// Show a user a list of their lesson plan pages (which will also contain their materials) with clickable URLs to each 

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@supabase/supabase-js';

export default function LessonPlans() {
  const router = useRouter();
  const { id } = router.query;
  const [lessonplanUrls, setLessonplanUrls] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchLessonplanUrls(id);
    }
  }, [id]);

  const fetchLessonplanUrls = async () => {
    const { data, error } = await supabase.from('lessonplans').select('*');
    if (error) {
      console.error('Error fetching lesson plan URLs:', error.message);
    } else {
      setLessonplanUrls(data);
    }
  };

  if (!lessonplanUrls.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Lesson Plans:</h2>
      {lessonplanUrls.map((lessonplan, index) => (
        <div key={index}>
          <h3>{lessonplan.lessonplan}</h3>
          <p>
            Curriculum: {lessonplan.curriculum},
            Grade level: {lessonplan.gradeLevel},
            Subject: {lessonplan.subject},
            Strand: {lessonplan.strand},
            Topic: {lessonplan.topic},
            Expectations: {lessonplan.expectations},
            Duration: {lessonplan.duration},
            Method: {lessonplan.method},
            Framework: {lessonplan.framework},
            Considerations: {lessonplan.considerations},
            Accommodations: {lessonplan.accommodations},
            Mode: {lessonplan.mode},
            URL: <a href={lessonplan.url}>{lessonplan.url}</a>
          </p>
        </div>
      ))}
    </div>
  );
}
