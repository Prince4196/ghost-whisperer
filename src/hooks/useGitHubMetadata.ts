import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { calculateProjectHealth, RepoData } from '@/lib/healthScore';

export interface GitHubRepoData {
  name: string;
  description: string;
  languages: Record<string, number>;
  lastCommitDate: string;
  lastCommitMessage: string;
  hasReadme: boolean;
  readmeContent: string;
  readmeWordCount: number;
  files: string[];
  hasPackageJson: boolean;
  hasRequirementsTxt: boolean;
  hasPomXml: boolean;
  hasGoMod: boolean;
  hasTestsFolder: boolean;
  hasGithubWorkflows: boolean;
  stars: number;
  forks: number;
  openIssues: number;
}

export interface GitHubMetadataResult {
  repoData: GitHubRepoData | null;
  healthScore: ReturnType<typeof calculateProjectHealth> | null;
  error: string | null;
}

export function useGitHubMetadata() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GitHubMetadataResult>({
    repoData: null,
    healthScore: null,
    error: null,
  });

  const fetchMetadata = async (repoUrl: string): Promise<GitHubMetadataResult> => {
    setLoading(true);
    setResult({ repoData: null, healthScore: null, error: null });

    try {
      const { data, error } = await supabase.functions.invoke('github-metadata', {
        body: { repoUrl },
      });

      if (error) {
        const errorResult = { repoData: null, healthScore: null, error: error.message };
        setResult(errorResult);
        return errorResult;
      }

      if (data.error) {
        const errorResult = { repoData: null, healthScore: null, error: data.error };
        setResult(errorResult);
        return errorResult;
      }

      const repoData = data as GitHubRepoData;

      // Calculate health score
      const healthInput: RepoData = {
        hasReadme: repoData.hasReadme,
        readmeWordCount: repoData.readmeWordCount,
        hasDependencyFile: repoData.hasPackageJson || repoData.hasRequirementsTxt || repoData.hasPomXml || repoData.hasGoMod,
        lastCommitDate: repoData.lastCommitDate ? new Date(repoData.lastCommitDate) : new Date(0),
        hasTestsFolder: repoData.hasTestsFolder,
        hasGithubWorkflows: repoData.hasGithubWorkflows,
        fileCount: repoData.files.length,
      };

      const healthScore = calculateProjectHealth(healthInput);

      const successResult = { repoData, healthScore, error: null };
      setResult(successResult);
      return successResult;

    } catch (err) {
      const errorResult = { 
        repoData: null, 
        healthScore: null, 
        error: err instanceof Error ? err.message : 'Failed to fetch metadata' 
      };
      setResult(errorResult);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchMetadata,
    loading,
    ...result,
  };
}
