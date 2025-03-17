interface CourseId {
  _id: string;
  // ... other properties if any
}

interface Progress {
  courseId: string | CourseId;
  // ... other properties
} 