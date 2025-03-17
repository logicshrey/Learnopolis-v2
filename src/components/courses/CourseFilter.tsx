interface CourseFilterProps {
  filters: {
    difficulty: string;
    subject: string;
  };
  setFilters: (filters: any) => void;
}

export default function CourseFilter({ filters, setFilters }: CourseFilterProps) {
  const difficulties = ['all', 'beginner', 'intermediate', 'advanced'];
  const subjects = ['all', 'electronics', 'mechanics', 'software', 'civil', 'chemical'];

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Difficulty
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {difficulties.map((difficulty) => (
              <option key={difficulty} value={difficulty}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subject
          </label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject.charAt(0).toUpperCase() + subject.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
} 