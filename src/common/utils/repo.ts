export function repoNameToId(repoName: string): string {
  return repoName.replace(/\//g, "-");
}

export function repoIdToName(repoId: string): string {
  return repoId.replace(/-/g, "/")
}
