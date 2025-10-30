import { table } from '@devvai/devv-code-backend';

const sampleCourses = [
  {
    _uid: 'system',
    title: 'Complete React Development Course',
    description: 'Master React from basics to advanced concepts with hands-on projects and real-world applications. Build modern web applications with confidence.',
    instructor: 'Sarah Johnson',
    category: 'React',
    price: 99,
    rating: 4.8,
    students: 12547,
    duration: '42 hours',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    level: 'Intermediate',
    tags: 'React,JavaScript,Frontend,Web Development,Components',
    created_at: new Date().toISOString(),
    status: 'published'
  },
  {
    _uid: 'system',
    title: 'Python for Data Science',
    description: 'Learn Python programming and data analysis with real-world projects. Master pandas, numpy, and machine learning fundamentals.',
    instructor: 'Michael Chen',
    category: 'Python',
    price: 89,
    rating: 4.7,
    students: 8932,
    duration: '35 hours',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&h=400&fit=crop',
    level: 'Beginner',
    tags: 'Python,Data Science,Machine Learning,Analytics,Programming',
    created_at: new Date().toISOString(),
    status: 'published'
  },
  {
    _uid: 'system',
    title: 'UI/UX Design Masterclass',
    description: 'Create beautiful and user-friendly interfaces from scratch. Learn design principles, user research, and prototyping.',
    instructor: 'Emily Rodriguez',
    category: 'Design',
    price: 79,
    rating: 4.9,
    students: 15632,
    duration: '28 hours',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=400&fit=crop',
    level: 'Intermediate',
    tags: 'UI Design,UX Design,Figma,Design Systems,Prototyping',
    created_at: new Date().toISOString(),
    status: 'published'
  },
  {
    _uid: 'system',
    title: 'Full-Stack JavaScript Development',
    description: 'Build complete web applications using Node.js, Express, and MongoDB. From frontend to backend deployment.',
    instructor: 'David Park',
    category: 'JavaScript',
    price: 129,
    rating: 4.6,
    students: 7891,
    duration: '56 hours',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&h=400&fit=crop',
    level: 'Advanced',
    tags: 'JavaScript,Node.js,Express,MongoDB,Full Stack,Web Development',
    created_at: new Date().toISOString(),
    status: 'published'
  },
  {
    _uid: 'system',
    title: 'Machine Learning with TensorFlow',
    description: 'Dive deep into machine learning and AI. Build neural networks, work with deep learning, and create AI applications.',
    instructor: 'Dr. Lisa Wang',
    category: 'Machine Learning',
    price: 149,
    rating: 4.5,
    students: 5234,
    duration: '48 hours',
    thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=400&fit=crop',
    level: 'Advanced',
    tags: 'Machine Learning,TensorFlow,AI,Deep Learning,Neural Networks',
    created_at: new Date().toISOString(),
    status: 'published'
  },
  {
    _uid: 'system',
    title: 'Modern CSS and Responsive Design',
    description: 'Master CSS Grid, Flexbox, and modern layout techniques. Create responsive designs that work on all devices.',
    instructor: 'Alex Thompson',
    category: 'CSS',
    price: 59,
    rating: 4.4,
    students: 9876,
    duration: '24 hours',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
    level: 'Beginner',
    tags: 'CSS,Responsive Design,Grid,Flexbox,Web Design',
    created_at: new Date().toISOString(),
    status: 'published'
  }
];

export const seedCourses = async () => {
  console.log('Seeding courses...');
  
  try {
    for (const course of sampleCourses) {
      await table.addItem('f0jve7e5o2kg', course);
      console.log(`Added course: ${course.title}`);
    }
    
    console.log('✅ All courses seeded successfully!');
    return true;
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
    return false;
  }
};

export const checkAndSeedCourses = async () => {
  try {
    // Check if courses already exist
    const response = await table.getItems('f0jve7e5o2kg', {
      limit: 1
    });
    
    if (response.items.length === 0) {
      console.log('No courses found, seeding database...');
      await seedCourses();
    } else {
      console.log('Courses already exist in database');
    }
  } catch (error) {
    console.error('Error checking courses:', error);
  }
};
