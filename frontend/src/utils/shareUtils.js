export const shareToWhatsApp = (url, title) =>
  window.open(`https://wa.me/?text=${encodeURIComponent(title + '\n' + url)}`, '_blank');

export const shareToX = (url, title) =>
  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');

export const shareToFacebook = (url) =>
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');

export const shareToLinkedIn = (url, title) =>
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');

export const copyLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch {
    return false;
  }
};
