export async function checkHealth(): Promise<{ status: string }> {
  return { status: 'OK' };
}
