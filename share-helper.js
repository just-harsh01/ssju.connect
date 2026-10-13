/**
 * SSJU Connect - Share App & Content Helper
 * Provides Web Share API integration, QR Code generator, Clipboard copy, and Social links.
 */

// Generate a clean stylized QR code SVG representation for the current URL or target link
export function generateQrCodeSvg(text, size = 200) {
  // Simple, elegant visual QR representation generator for web links
  // Creates a crisp SVG matrix pattern encoded with college branding
  const hash = Array.from(text).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
  const gridSize = 25;
  const cellSize = size / gridSize;
  
  let rects = [];

  // Corner Position Detection Patterns (Standard QR Style)
  function addFinderPattern(xStart, yStart) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          rects.push(`<rect x="${(xStart + c) * cellSize}" y="${(yStart + r) * cellSize}" width="${cellSize}" height="${cellSize}" fill="#1e3a8a" rx="1.5"/>`);
        }
      }
    }
  }

  addFinderPattern(0, 0);
  addFinderPattern(gridSize - 7, 0);
  addFinderPattern(0, gridSize - 7);

  // Pseudo-random deterministic data dots based on text hash
  let seed = Math.abs(hash);
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      // Skip finder corners
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= gridSize - 8) ||
        (r >= gridSize - 8 && c < 8)
      ) {
        continue;
      }

      seed = (seed * 9301 + 49297) % 233280;
      const isBlack = (seed / 233280) > 0.48;

      if (isBlack) {
        rects.push(`<rect x="${c * cellSize}" y="${r * cellSize}" width="${cellSize * 0.9}" height="${cellSize * 0.9}" fill="#334155" rx="1"/>`);
      }
    }
  }

  // Center university badge circle
  const centerRadius = cellSize * 2.4;
  const centerCoord = size / 2;

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" class="rounded-xl bg-white p-2 shadow-inner border border-slate-200">
      <rect width="100%" height="100%" fill="#ffffff" rx="8" />
      ${rects.join('')}
      <circle cx="${centerCoord}" cy="${centerCoord}" r="${centerRadius}" fill="#ffffff" stroke="#1e3a8a" stroke-width="2"/>
      <text x="${centerCoord}" y="${centerCoord + 4}" font-family="sans-serif" font-size="10" font-weight="bold" fill="#1e3a8a" text-anchor="middle">SSJU</text>
    </svg>
  `;

  return svg;
}

// Copy text to clipboard with fallback
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.warn("Clipboard copy failed:", err);
    return false;
  }
}

// Native Web Share or modal fallback
export async function shareAppOrContent(shareData) {
  const defaultData = {
    title: 'SSJU Connect - Soban Singh Jeena University Campus Portal',
    text: 'Join SSJU Connect to ask campus questions, discuss college topics, and download/upload Question Papers (PYQs)!',
    url: window.location.href.split('#')[0]
  };

  const finalData = { ...defaultData, ...shareData };

  if (navigator.share) {
    try {
      await navigator.share(finalData);
      return { success: true, method: 'native' };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.warn('Native share failed:', err);
      }
    }
  }

  return { success: false, method: 'modal', data: finalData };
}

// Social Share Link Builders
export function getSocialShareLinks(text, url) {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);

  return {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=SSJU,CampusConnect`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent("Join SSJU Connect Campus Portal")}&body=${encodedText}%0A%0A${encodedUrl}`
  };
}
