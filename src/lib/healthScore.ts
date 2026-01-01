// Project Health Score Calculator - "The Pulse Check"

export interface RepoData {
  hasReadme: boolean;
  readmeWordCount: number;
  hasDependencyFile: boolean;
  lastCommitDate: Date;
  hasTestsFolder: boolean;
  hasGithubWorkflows: boolean;
  fileCount: number;
}

export interface HealthScore {
  total: number;
  documentation: number;
  structure: number;
  freshness: number;
  stability: number;
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F';
  status: 'Thriving' | 'Stable' | 'Fading' | 'Ghosted' | 'Ancient Relic';
}

export function calculateProjectHealth(repoData: RepoData): HealthScore {
  let documentation = 0;
  let structure = 0;
  let freshness = 0;
  let stability = 0;

  // Documentation (35% weight, max 35 points)
  if (repoData.hasReadme) {
    documentation += 20;
    if (repoData.readmeWordCount > 500) {
      documentation += 15;
    } else if (repoData.readmeWordCount > 200) {
      documentation += 8;
    } else if (repoData.readmeWordCount > 50) {
      documentation += 3;
    }
  }

  // Structure (25% weight, max 25 points)
  if (repoData.hasDependencyFile) {
    structure += 25;
  }

  // Freshness (20% weight, max 20 points)
  const now = new Date();
  const lastCommit = new Date(repoData.lastCommitDate);
  const monthsAgo = (now.getTime() - lastCommit.getTime()) / (1000 * 60 * 60 * 24 * 30);

  if (monthsAgo < 6) {
    freshness = 20;
  } else if (monthsAgo < 12) {
    freshness = 10;
  } else {
    freshness = 0; // Ancient Relic
  }

  // Stability (20% weight, max 20 points)
  if (repoData.hasTestsFolder || repoData.hasGithubWorkflows) {
    stability = 20;
  } else if (repoData.hasTestsFolder || repoData.hasGithubWorkflows) {
    stability = 10;
  }

  const total = documentation + structure + freshness + stability;

  // Determine grade
  let grade: HealthScore['grade'];
  if (total >= 90) grade = 'S';
  else if (total >= 75) grade = 'A';
  else if (total >= 60) grade = 'B';
  else if (total >= 45) grade = 'C';
  else if (total >= 30) grade = 'D';
  else grade = 'F';

  // Determine status
  let status: HealthScore['status'];
  if (total >= 80) status = 'Thriving';
  else if (total >= 60) status = 'Stable';
  else if (total >= 40) status = 'Fading';
  else if (freshness === 0) status = 'Ancient Relic';
  else status = 'Ghosted';

  return {
    total,
    documentation,
    structure,
    freshness,
    stability,
    grade,
    status,
  };
}

export function getHealthColor(score: number): string {
  if (score >= 80) return 'hsl(120, 100%, 50%)'; // Bright green
  if (score >= 60) return 'hsl(90, 100%, 45%)';  // Yellow-green
  if (score >= 40) return 'hsl(45, 100%, 50%)';  // Yellow/Orange
  if (score >= 20) return 'hsl(20, 100%, 50%)';  // Orange
  return 'hsl(0, 100%, 50%)';                     // Red
}

export function getTimeUntilExpiry(expiryDate: Date): string {
  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();
  
  if (diff <= 0) return 'EXPIRED';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 30) return `${Math.floor(days / 30)} months`;
  if (days > 0) return `${days}d ${hours}h`;
  return `${hours}h remaining`;
}

export function getGhostAge(createdAt: Date): string {
  const now = new Date();
  const diff = now.getTime() - createdAt.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) return `${years} year${years > 1 ? 's' : ''} old`;
  if (months > 0) return `${months} month${months > 1 ? 's' : ''} old`;
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} old`;
  return 'Just ghosted';
}
