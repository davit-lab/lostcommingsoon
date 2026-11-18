const FRAMER_IMAGE_HOST = 'framerusercontent.com';
const IMAGE_WIDTHS = [300, 400, 600, 900, 1400, 1920];

function getFramerImageUrl(source: string, maxEdge: number): string {
  try {
    const url = new URL(source);
    if (url.hostname !== FRAMER_IMAGE_HOST || !url.pathname.startsWith('/images/')) {
      return source;
    }

    url.searchParams.set('scale-down-to', String(maxEdge));
    return url.toString();
  } catch {
    return source;
  }
}

export function optimizeFramerImageUrl(source: string, maxEdge: number): string {
  return getFramerImageUrl(source, maxEdge);
}

export function getFramerImageProps(
  source: string,
  maxEdge: number,
): { src: string; srcSet?: string } {
  const src = getFramerImageUrl(source, maxEdge);

  try {
    const url = new URL(source);
    if (url.hostname !== FRAMER_IMAGE_HOST || !url.pathname.startsWith('/images/')) {
      return { src };
    }

    const width = Number(url.searchParams.get('width'));
    const height = Number(url.searchParams.get('height'));
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return { src };
    }

    const originalMaxEdge = Math.max(width, height);
    const candidates = IMAGE_WIDTHS
      .filter((edge) => edge <= maxEdge)
      .map((edge) => {
        const outputWidth = Math.min(width, Math.round((width * edge) / originalMaxEdge));
        return {
          width: outputWidth,
          url: getFramerImageUrl(source, edge),
        };
      });

    const uniqueCandidates = new Map<number, string>();
    candidates.forEach(({ width: candidateWidth, url: candidateUrl }) => {
      uniqueCandidates.set(candidateWidth, candidateUrl);
    });

    if (uniqueCandidates.size < 2) {
      return { src };
    }

    const srcSet = Array.from(uniqueCandidates, ([candidateWidth, candidateUrl]) =>
      `${candidateUrl} ${candidateWidth}w`,
    ).join(', ');

    return { src, srcSet };
  } catch {
    return { src };
  }
}
