import JSZip from 'jszip';
import { triggerDownload } from './fileHelpers';

export async function downloadAsZip(
  files: Array<{ url: string; name: string }>,
  zipName: string = 'converted-files.zip',
): Promise<void> {
  const zip = new JSZip();

  const fetchPromises = files.map(async (file) => {
    const response = await fetch(file.url);
    const blob = await response.blob();
    zip.file(file.name, blob);
  });

  await Promise.all(fetchPromises);

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });
  const zipUrl = URL.createObjectURL(zipBlob);
  triggerDownload(zipUrl, zipName);
  URL.revokeObjectURL(zipUrl);
}
