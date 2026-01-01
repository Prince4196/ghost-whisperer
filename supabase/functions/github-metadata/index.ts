import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GitHubRepoData {
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

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)/,
    /github\.com:([^\/]+)\/([^\/]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2].replace('.git', '') };
    }
  }
  return null;
}

async function fetchGitHub(endpoint: string): Promise<Response> {
  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Ghost-Project-App',
    },
  });
  return response;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { repoUrl } = await req.json();
    
    if (!repoUrl) {
      return new Response(
        JSON.stringify({ error: 'Repository URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Fetching metadata for:', repoUrl);

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return new Response(
        JSON.stringify({ error: 'Invalid GitHub URL format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { owner, repo } = parsed;
    console.log(`Parsed: owner=${owner}, repo=${repo}`);

    // Fetch repo info
    const repoResponse = await fetchGitHub(`/repos/${owner}/${repo}`);
    if (!repoResponse.ok) {
      const status = repoResponse.status;
      if (status === 404) {
        return new Response(
          JSON.stringify({ error: 'Repository not found or is private' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`GitHub API error: ${status}`);
    }
    const repoInfo = await repoResponse.json();

    // Fetch languages
    const languagesResponse = await fetchGitHub(`/repos/${owner}/${repo}/languages`);
    const languages = languagesResponse.ok ? await languagesResponse.json() : {};

    // Fetch last commit
    const commitsResponse = await fetchGitHub(`/repos/${owner}/${repo}/commits?per_page=1`);
    const commits = commitsResponse.ok ? await commitsResponse.json() : [];
    const lastCommit = commits[0] || null;

    // Fetch README
    const readmeResponse = await fetchGitHub(`/repos/${owner}/${repo}/readme`);
    let readmeContent = '';
    let hasReadme = false;
    if (readmeResponse.ok) {
      const readmeData = await readmeResponse.json();
      hasReadme = true;
      // Decode base64 content
      try {
        readmeContent = atob(readmeData.content.replace(/\n/g, ''));
      } catch {
        readmeContent = '';
      }
    }

    // Fetch root files
    const contentsResponse = await fetchGitHub(`/repos/${owner}/${repo}/contents`);
    const contents = contentsResponse.ok ? await contentsResponse.json() : [];
    const files = Array.isArray(contents) ? contents.map((f: { name: string }) => f.name) : [];

    // Check for dependency files
    const hasPackageJson = files.includes('package.json');
    const hasRequirementsTxt = files.includes('requirements.txt');
    const hasPomXml = files.includes('pom.xml');
    const hasGoMod = files.includes('go.mod');

    // Check for tests folder
    const hasTestsFolder = files.some((f: string) => 
      f.toLowerCase() === 'tests' || 
      f.toLowerCase() === 'test' || 
      f.toLowerCase() === '__tests__'
    );

    // Check for .github/workflows
    let hasGithubWorkflows = false;
    if (files.includes('.github')) {
      const githubResponse = await fetchGitHub(`/repos/${owner}/${repo}/contents/.github`);
      if (githubResponse.ok) {
        const githubContents = await githubResponse.json();
        hasGithubWorkflows = Array.isArray(githubContents) && 
          githubContents.some((f: { name: string }) => f.name === 'workflows');
      }
    }

    const repoData: GitHubRepoData = {
      name: repoInfo.name,
      description: repoInfo.description || '',
      languages,
      lastCommitDate: lastCommit?.commit?.author?.date || '',
      lastCommitMessage: lastCommit?.commit?.message || '',
      hasReadme,
      readmeContent,
      readmeWordCount: readmeContent.split(/\s+/).filter(Boolean).length,
      files,
      hasPackageJson,
      hasRequirementsTxt,
      hasPomXml,
      hasGoMod,
      hasTestsFolder,
      hasGithubWorkflows,
      stars: repoInfo.stargazers_count || 0,
      forks: repoInfo.forks_count || 0,
      openIssues: repoInfo.open_issues_count || 0,
    };

    console.log('Successfully fetched metadata for:', repo);

    return new Response(
      JSON.stringify(repoData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: unknown) {
    console.error('Error fetching GitHub metadata:', error);
    const message = error instanceof Error ? error.message : 'Failed to fetch repository metadata';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
