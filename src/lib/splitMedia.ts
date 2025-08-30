

export function splitMedia(media: any[]) {
  const images = media.filter((m) => m.mediaType === "Image");
  const videos = media.filter((m) => m.mediaType === "Video");
  return { images, videos };
}
