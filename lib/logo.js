// Shrink a logo data-URL before storing it in D1. A full-resolution PNG as
// base64 can be hundreds of KB and blow past the row size limit; 360×160 is
// still print-sharp on an A4 invoice header.

export function compressLogoDataUrl(src, maxW = 360, maxH = 160) {
  return new Promise((resolve) => {
    if (!src || typeof src !== "string") return resolve(null);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      try {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/png"));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export function readLogoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const r = new FileReader();
    r.onload = async (ev) => resolve(await compressLogoDataUrl(ev.target.result));
    r.onerror = () => reject(r.error || new Error("read_failed"));
    r.readAsDataURL(file);
  });
}

// Job photos (before/after shots on trade invoices). JPEG, not PNG: a photo
// as PNG base64 is ~3× the size for no visible gain on an A4 print, and
// several photos have to fit in one D1 row alongside the logo.
export function compressPhotoDataUrl(src, maxW = 720, maxH = 540) {
  return new Promise((resolve) => {
    if (!src || typeof src !== "string") return resolve(null);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width, maxH / img.height);
      const w = Math.max(1, Math.round(img.width * scale));
      const h = Math.max(1, Math.round(img.height * scale));
      try {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        c.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL("image/jpeg", 0.82));
      } catch {
        resolve(src);
      }
    };
    img.onerror = () => resolve(src);
    img.src = src;
  });
}

export function readPhotoFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const r = new FileReader();
    r.onload = async (ev) => resolve(await compressPhotoDataUrl(ev.target.result));
    r.onerror = () => reject(r.error || new Error("read_failed"));
    r.readAsDataURL(file);
  });
}
