async function getGithubData() {
  const response = await fetch('https://api.github.com/repos/albumentations-team/albumentations', { next: { revalidate: 600 } });

  if (!response.ok) {
    throw new Error('Failed to fetch GitHub data');
  }

  return response.json();
}

async function getPyPIData() {
  const response = await fetch('https://hugovk.github.io/top-pypi-packages/top-pypi-packages-30-days.min.json');

  if (!response.ok) {
    throw new Error('Failed to fetch PyPI data');
  }

  const data = await response.json();
  const rank = data.rows.findIndex((pkg: any) => pkg.project === "albumentations") + 1; // +1 to adjust zero-based index

  return rank;
}

export default async function Home() {
  try {
    const githubData = await getGithubData();
    const albumentationsRank = await getPyPIData();

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-center">Albumentations Repository Stats</h1>
        <div className="mt-8 flex flex-col justify-center items-center space-y-4">
          <p className="text-lg">⭐ Stars: <span className="font-bold">{githubData.stargazers_count}</span></p>
          <p className="text-lg">🍴 Forks: <span className="font-bold">{githubData.forks_count}</span></p>
          <p className="text-lg">📈 Rank on PyPI: <span className="font-bold">{albumentationsRank || 'Not in top 50'}</span></p>
        </div>
      </div>
    );
  } catch (error) {
    console.error((error as Error).message);
    // Implement or define a fallback UI or error handling strategy here
    return (
      <div>Error loading data. Please try again later.</div>
    );
  }
};
