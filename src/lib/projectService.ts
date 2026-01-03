import { doc, setDoc, serverTimestamp, collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getCurrentUserRealName, getCurrentUserEmail } from "./authService";

interface ProjectSubmission {
  title: string;
  githubUrl: string;
  ghostLog: string;
  deadManSwitch: number; // in months
}

interface GitHubRepoData {
  documentationScore: number;
  structureScore: number;
  activityScore: number;
}

// GitHub API token is not used directly in this version
// All GitHub API calls are handled via Supabase functions
const GITHUB_TOKEN = '';

/**
 * Fetches repository data from GitHub API
 */
const fetchGitHubRepoData = async (repoUrl: string): Promise<any> => {
  try {
    // Extract owner and repo name from URL
    const url = new URL(repoUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error('Invalid GitHub URL');
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    // Fetch repository info
    // For security reasons, GitHub API calls are now handled via Supabase functions
    // This is a placeholder that returns a default response
    return {
      name: repo,
      owner: { login: owner },
      description: 'Project description',
      stargazers_count: 0,
      forks_count: 0,
      language: 'Unknown',
      pushed_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error fetching GitHub repo data:', error);
    throw error;
  }
};

/**
 * Fetches README content to check documentation
 */
const fetchReadmeContent = async (owner: string, repo: string): Promise<string> => {
  try {
    // For security reasons, GitHub API calls are now handled via Supabase functions
    // This is a placeholder that returns a default response
    return 'Default README content';
  } catch (error) {
    console.error('Error fetching README:', error);
    return '';
  }
};

/**
 * Calculates the health score for a repository
 */
const calculateHealthScore = async (repoData: any): Promise<number> => {
  try {
    // Extract owner and repo name from the repo URL
    const url = new URL(repoData.html_url);
    const pathParts = url.pathname.split('/').filter(Boolean);
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    // Documentation score (30 pts)
    let documentationScore = 0;
    const readmeContent = await fetchReadmeContent(owner, repo);
    // Count words in README content
    const readmeWordCount = readmeContent ? readmeContent.split(/\s+/).length : 0;
    if (readmeWordCount > 500) {
      documentationScore = 30;
    } else if (readmeWordCount > 250) {
      documentationScore = 15; // Half points
    }
    
    // Structure score (30 pts)
    let structureScore = 0;
    // Check for package.json or requirements.txt
    try {
      // For security reasons, GitHub API calls are now handled via Supabase functions
      // Default to some points if we can't check
      return 10;
    } catch (error) {
      console.error('Error checking repository structure:', error);
      // If structure check fails, assign partial points
      structureScore = 10; // Default to some points if we can't check
    }
    
    // Activity score (40 pts)
    let activityScore = 0;
    // Get last commit date
    try {
      // For security reasons, GitHub API calls are now handled via Supabase functions
      // Default to some points if we can't check
      return 10;
    } catch (error) {
      console.error('Error checking repository activity:', error);
      // If activity check fails, assign partial points
      activityScore = 10; // Default to some points if we can't check
    }
    
    const totalScore = documentationScore + structureScore + activityScore;
    return Math.min(100, totalScore); // Cap at 100
  } catch (error) {
    console.error('Error calculating health score:', error);
    // Return a default score in case of error
    return 50;
  }
};

/**
 * Submits a project to the Ghost Project platform
 */
export interface ProjectSubmissionResult {
  success: boolean;
  message: string;
  projectId?: string;
}

export const submitProject = async (projectData: ProjectSubmission): Promise<ProjectSubmissionResult> => {
  try {
    // Get current user's real name and email
    const creatorRealName = await getCurrentUserRealName();
    const creatorEmail = await getCurrentUserEmail();
    if (!creatorRealName || !creatorEmail) {
      throw new Error('User not authenticated');
    }
    
    let vitalityScore = 60; // Default score
    let repoData: any = {};
    let owner = '', repo = '';
    
    try {
      // Attempt to fetch repository data from GitHub API
      repoData = await fetchGitHubRepoData(projectData.githubUrl);
      
      // Extract owner and repo from the repoData after successful API call
      const url = new URL(projectData.githubUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        owner = pathParts[0];
        repo = pathParts[1];
      } else {
        throw new Error('Invalid GitHub URL');
      }
      
      // Calculate vitality score
      vitalityScore = await calculateHealthScore(repoData);
    } catch (apiError) {
      console.error('GitHub API error (using default score):', apiError);
      // Continue with default vitality score of 60
      
      // Try to extract owner and repo from URL even if API fails
      const url = new URL(projectData.githubUrl);
      const pathParts = url.pathname.split('/').filter(Boolean);
      if (pathParts.length >= 2) {
        owner = pathParts[0];
        repo = pathParts[1];
      } else {
        throw new Error('Invalid GitHub URL');
      }
    }
    
    console.log('Saving Data...', projectData);
    
    // Calculate expiry date based on dead man's switch
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + projectData.deadManSwitch);
    
    // Prepare project data for Firestore
    const projectDoc = {
      title: projectData.title,
      githubUrl: projectData.githubUrl,
      ghostLog: projectData.ghostLog,
      vitalityScore, // Changed from healthScore to vitalityScore
      status: 'Seeking', // Changed from 'Ghosted' to 'Seeking'
      creator: creatorRealName, // Use real name instead of ghost name
      creatorEmail: creatorEmail, // Added creator email field
      timestamp: serverTimestamp(), // Added timestamp field
      createdAt: serverTimestamp(),
      lastCheckIn: serverTimestamp(),
      deadManSwitchMonths: projectData.deadManSwitch,
      repoInfo: {
        owner,
        name: repo,
        description: (repoData as any)?.description || '',
        stars: (repoData as any)?.stargazers_count || 0,
        forks: (repoData as any)?.forks_count || 0,
        language: (repoData as any)?.language || 'Unknown'
      }
    };
    
    // Save to Firestore using auto-generated ID
    const projectsCollection = collection(db, 'projects');
    const projectDocRef = await addDoc(projectsCollection, projectDoc);
    
    console.log('Saved Successfully!');
    
    return {
      success: true,
      message: `Project '${projectData.title}' successfully ghosted to the vault!`,
      projectId: projectDocRef.id
    };
  } catch (error) {
    console.error('Error submitting project:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit project'
    };
  }
};