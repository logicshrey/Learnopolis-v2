import { Module } from '@/types';

interface ModuleListProps {
  modules: Module[];
  currentModuleIndex: number;
  setCurrentModule: (index: number) => void;
  completedModules: number[];
}

export default function ModuleList({
  modules,
  currentModuleIndex,
  setCurrentModule,
  completedModules
}: ModuleListProps) {
  return (
    <div className="space-y-2">
      {modules.map((module, index) => (
        <button
          key={index}
          onClick={() => setCurrentModule(index)}
          className={`w-full text-left p-3 rounded-md transition-colors ${
            currentModuleIndex === index
              ? 'bg-indigo-100 text-indigo-700'
              : 'hover:bg-gray-100'
          }`}
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
              completedModules.includes(index)
                ? 'bg-green-100 text-green-600'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {completedModules.includes(index) ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span className="text-sm font-medium">{module.title}</span>
          </div>
        </button>
      ))}
    </div>
  );
} 