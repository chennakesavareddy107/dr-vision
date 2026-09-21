const API_BASE = 'http://localhost:8000/api';

export async function predictImage(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/predict`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to predict image');
  }

  return response.json();
}

export async function getGradCam(file: File, targetClass?: number) {
  const formData = new FormData();
  formData.append('file', file);
  if (targetClass !== undefined) {
    formData.append('target_class', targetClass.toString());
  }

  const response = await fetch(`${API_BASE}/gradcam`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to generate Grad-CAM');
  }

  return response.json();
}

export async function analyzeLesions(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/lesion-analysis`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze lesions');
  }

  return response.json();
}
