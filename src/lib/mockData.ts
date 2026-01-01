import { generateGhostName } from './ghostNameGenerator';
import { calculateProjectHealth, type RepoData } from './healthScore';

export interface Project {
  id: string;
  title: string;
  description: string;
  ghostId: string;
  ghostName: string;
  repoUrl: string;
  healthScore: ReturnType<typeof calculateProjectHealth>;
  status: 'available' | 'haunted' | 'expired';
  parentId: string | null;
  generation: number;
  expiryDate: Date;
  createdAt: Date;
  lastCheckIn: Date;
  languages: string[];
  stars: number;
  ghostLog: string;
  haunters: { ghostName: string; hauntedAt: Date }[];
}

export interface GhostLog {
  id: string;
  projectId: string;
  content: string;
  timestamp: Date;
}

// Generate mock projects
function createMockProject(
  id: string,
  title: string,
  description: string,
  repoData: Partial<RepoData>,
  overrides: Partial<Project> = {}
): Project {
  const ghostId = `ghost-${id}`;
  const ghostName = generateGhostName(ghostId);
  
  const fullRepoData: RepoData = {
    hasReadme: true,
    readmeWordCount: 300,
    hasDependencyFile: true,
    lastCommitDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    hasTestsFolder: false,
    hasGithubWorkflows: false,
    fileCount: 15,
    ...repoData,
  };

  const healthScore = calculateProjectHealth(fullRepoData);
  
  const createdAt = new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000);
  const expiryMonths = [3, 6, 12][Math.floor(Math.random() * 3)];
  const expiryDate = new Date(createdAt.getTime() + expiryMonths * 30 * 24 * 60 * 60 * 1000);

  return {
    id,
    title,
    description,
    ghostId,
    ghostName,
    repoUrl: `https://github.com/campus-ghosts/${title.toLowerCase().replace(/\s+/g, '-')}`,
    healthScore,
    status: expiryDate < new Date() ? 'expired' : 'available',
    parentId: null,
    generation: 1,
    expiryDate,
    createdAt,
    lastCheckIn: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000),
    languages: ['TypeScript', 'JavaScript', 'Python', 'Rust', 'Go'].slice(0, Math.floor(Math.random() * 3) + 1),
    stars: Math.floor(Math.random() * 50),
    ghostLog: `Final transmission from ${ghostName}: This project was my passion during sophomore year. The authentication system is solid, but the payment integration needs work. Good luck, future haunter.`,
    haunters: [],
    ...overrides,
  };
}

export const mockProjects: Project[] = [
  createMockProject(
    '1',
    'NeuralNote',
    'AI-powered note-taking app with semantic search and auto-tagging',
    { hasReadme: true, readmeWordCount: 850, hasTestsFolder: true, hasGithubWorkflows: true },
    { languages: ['TypeScript', 'Python'], stars: 42 }
  ),
  createMockProject(
    '2',
    'CampusConnect',
    'Real-time study group finder and scheduling platform',
    { hasReadme: true, readmeWordCount: 320, lastCommitDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    { languages: ['JavaScript', 'Node.js'], stars: 28, generation: 2, haunters: [{ ghostName: generateGhostName('prev-1'), hauntedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }] }
  ),
  createMockProject(
    '3',
    'CodeReview Bot',
    'Automated PR review assistant with GPT-4 integration',
    { hasReadme: true, readmeWordCount: 1200, hasGithubWorkflows: true },
    { languages: ['Python', 'TypeScript'], stars: 67 }
  ),
  createMockProject(
    '4',
    'Dormitory Dashboard',
    'IoT control panel for smart dorm room automation',
    { hasReadme: false, readmeWordCount: 0, lastCommitDate: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000) },
    { languages: ['Rust', 'C++'], stars: 12, status: 'expired' }
  ),
  createMockProject(
    '5',
    'LectureSync',
    'Real-time lecture transcription with markdown export',
    { hasReadme: true, readmeWordCount: 450, hasTestsFolder: true },
    { languages: ['TypeScript'], stars: 35, generation: 3, haunters: [
      { ghostName: generateGhostName('prev-2'), hauntedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000) },
      { ghostName: generateGhostName('prev-3'), hauntedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
    ]}
  ),
  createMockProject(
    '6',
    'ExamCram',
    'Spaced repetition flashcard system with AI-generated questions',
    { hasReadme: true, readmeWordCount: 680, hasDependencyFile: true },
    { languages: ['JavaScript', 'Python'], stars: 89 }
  ),
  createMockProject(
    '7',
    'BugBountyTracker',
    'Campus CTF competition scoreboard and challenge manager',
    { hasReadme: true, readmeWordCount: 920, hasTestsFolder: true, hasGithubWorkflows: true },
    { languages: ['Go', 'TypeScript'], stars: 156 }
  ),
  createMockProject(
    '8',
    'MealPlanOptimizer',
    'Dining hall menu analyzer with nutrition tracking',
    { hasReadme: true, readmeWordCount: 200, lastCommitDate: new Date(Date.now() - 200 * 24 * 60 * 60 * 1000) },
    { languages: ['Python'], stars: 8, status: 'expired' }
  ),
];

export const platformStats = {
  projectsResurrected: 43,
  ghostsAwaiting: 12,
  totalHaunters: 87,
  activeSwitches: 24,
  averageHealthScore: 62,
  oldestGhost: '2.3 years',
};
