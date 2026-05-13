import { execSync } from 'node:child_process';
import type { AuditMetric } from '../types.ts';

const IMAGES = [
  { name: 'API Docker image', image: 'nguyenson1710/wanderviet-api', target: '< 500 MB' },
  { name: 'Web Docker image', image: 'nguyenson1710/wanderviet-web', target: '< 500 MB' },
];

function getDockerImageSize(image: string): string {
  try {
    // Check if Docker is available
    execSync('docker info', { encoding: 'utf-8', timeout: 10_000, stdio: 'pipe' });

    // Try to get image size from local Docker
    let result: string;
    try {
      result = execSync(`docker images ${image} --format "{{.Size}}"`, {
        encoding: 'utf-8',
        timeout: 15_000,
      }).trim();
    } catch {
      result = '';
    }

    // Get first line only
    const firstLine = result.split('\n')[0]?.trim() ?? '';

    if (firstLine) {
      return firstLine;
    }

    return 'image not found locally';
  } catch {
    return 'Docker not available — cannot measure';
  }
}

export function collectDockerImageSize(rootDir: string): AuditMetric[] {
  return IMAGES.map(({ name, image, target }) => {
    const size = getDockerImageSize(image);
    const isAutomated = !size.includes('not available') && !size.includes('not found');

    return {
      name,
      currentValue: size,
      target,
      automated: isAutomated,
      command: `docker images ${image} --format "{{.Repository}}:{{.Tag}} {{.Size}}"`,
      ...(!isAutomated && {
        manualProcedure: `Build the image first: docker build -t ${image} -f apps/${image.includes('api') ? 'api' : 'web'}/Dockerfile . && docker images ${image}`,
      }),
    };
  });
}
