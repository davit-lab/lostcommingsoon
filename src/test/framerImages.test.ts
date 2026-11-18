import { describe, expect, it } from 'vitest';
import { getFramerImageProps, optimizeFramerImageUrl } from '@/lib/framerImages';

describe('Framer image URLs', () => {
  it('adds or replaces only the supported scale-down transform', () => {
    const source =
      'https://framerusercontent.com/images/photo.jpg?width=3648&height=5472&scale-down-to=1200&scale-down-to=900';
    const optimized = new URL(optimizeFramerImageUrl(source, 600));

    expect(optimized.searchParams.get('width')).toBe('3648');
    expect(optimized.searchParams.get('height')).toBe('5472');
    expect(optimized.searchParams.getAll('scale-down-to')).toEqual(['600']);
  });

  it.each([
    'https://images.example.com/photo.jpg?width=2400',
    'data:image/png;base64,abc',
    '/images/local-photo.jpg',
  ])('does not rewrite unsupported URL %s', (source) => {
    expect(optimizeFramerImageUrl(source, 600)).toBe(source);
  });

  it('creates correctly sized responsive candidates when source dimensions are known', () => {
    const props = getFramerImageProps(
      'https://framerusercontent.com/images/photo.jpg?width=3648&height=5472',
      600,
    );

    expect(props.src).toContain('scale-down-to=600');
    expect(props.srcSet).toContain('scale-down-to=300 200w');
    expect(props.srcSet).toContain('scale-down-to=600 400w');
  });

  it('omits srcset when source dimensions cannot be trusted', () => {
    const props = getFramerImageProps(
      'https://framerusercontent.com/images/photo.jpg?width=540&height=960%20540w',
      600,
    );
    const optimized = new URL(props.src);

    expect(props.srcSet).toBeUndefined();
    expect(optimized.searchParams.get('width')).toBe('540');
    expect(optimized.searchParams.get('height')).toBe('960 540w');
    expect(optimized.searchParams.get('scale-down-to')).toBe('600');
  });
});
