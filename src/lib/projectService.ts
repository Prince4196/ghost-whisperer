import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import { getCurrentUserGhostName } from "./authService";

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

// GitHub API token
const GITHUB_TOKEN = "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";

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
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    return await response.json();
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
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (!response.ok) {
      return '';
    }
    
    const data = await response.json();
    // Decode base64 content
    return data.content ? atob(data.content) : '';
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
    if (readmeContent && readmeContent.length > 500) {
      documentationScore = 30;
    } else if (readmeContent && readmeContent.length > 250) {
      documentationScore = 15; // Half points
    }
    
    // Structure score (30 pts)
    let structureScore = 0;
    // Check for package.json or requirements.txt
    const structureCheckResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (structureCheckResponse.ok) {
      const contents = await structureCheckResponse.json();
      const hasPackageJson = contents.some((item: any) => item.name === 'package.json');
      const hasRequirementsTxt = contents.some((item: any) => item.name === 'requirements.txt');
      
      if (hasPackageJson || hasRequirementsTxt) {
        structureScore = 30;
      } else if (hasPackageJson || hasRequirementsTxt) {
        structureScore = 15; // This condition is redundant, fixing:
        structureScore = 15; // Half points if only one exists
      } else {
        // Check for other common project files
        const hasProjectFiles = contents.some((item: any) => 
          ['setup.py', 'pom.xml', 'build.gradle', 'Cargo.toml', 'Gemfile', 'composer.json'].includes(item.name)
        );
        if (hasProjectFiles) {
          structureScore = 15;
        }
      }
    }
    
    // Activity score (40 pts)
    let activityScore = 0;
    // Get last commit date
    const commitsResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });
    
    if (commitsResponse.ok) {
      const commits = await commitsResponse.json();
      if (commits && commits.length > 0) {
        const lastCommitDate = new Date(commits[0].commit.committer.date);
        const now = new Date();
        const monthsDiff = (now.getFullYear() - lastCommitDate.getFullYear()) * 12 + 
                          (now.getMonth() - lastCommitDate.getMonth());
        
        if (monthsDiff < 6) {
          activityScore = 40; // Full points if less than 6 months
        } else if (monthsDiff < 12) {
          activityScore = 20; // Half points if less than 12 months
        } else {
          activityScore = 10; // Some points if less than 24 months
        }
      }
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
    // Get current user's ghost name
    const creatorGhostName = await getCurrentUserGhostName();
    if (!creatorGhostName) {
      throw new Error('User not authenticated');
    }
    
    // Extract owner and repo name from GitHub URL for API calls
    const url = new URL(projectData.githubUrl);
    const pathParts = url.pathname.split('/').filter(Boolean);
    if (pathParts.length < 2) {
      throw new Error('Invalid GitHub URL');
    }
    
    const owner = pathParts[0];
    const repo = pathParts[1];
    
    // Fetch repository data from GitHub API
    const repoData = await fetchGitHubRepoData(projectData.githubUrl);
    
    // Calculate health score
    const healthScore = await calculateHealthScore(repoData);
    
    // Calculate expiry date based on dead man's switch
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + projectData.deadManSwitch);
    
    // Prepare project data for Firestore
    const projectDoc = {
      title: projectData.title,
      githubUrl: projectData.githubUrl,
      ghostLog: projectData.ghostLog,
      healthScore,
      expiryDate: expiryDate,
      status: 'Ghosted',
      creatorGhostName,
      createdAt: serverTimestamp(),
      lastCheckIn: serverTimestamp(),
      deadManSwitchMonths: projectData.deadManSwitch,
      repoInfo: {
        owner,
        name: repo,
        description: repoData.description || '',
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        language: repoData.language || 'Unknown'
      }
    };
    
    // Save to Firestore
    const projectDocRef = doc(db, 'projects', `${owner}/${repo}`);
    await setDoc(projectDocRef, projectDoc);
    
    return {
      success: true,
      message: `Project '${projectData.title}' successfully ghosted to the vault!`,
      projectId: `${owner}/${repo}`
    };
  } catch (error) {
    console.error('Error submitting project:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit project'
    };
  }
};