import * as faceapi from 'face-api.js';

const MODEL_URL = '/models';

export const loadModels = async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  } catch (error) {
    console.error('Error loading face-api models:', error);
    throw new Error('Failed to load face recognition models.');
  }
};

export const detectSingleFace = async (video: HTMLVideoElement) => {
  if (!video) {
    return null;
  }
  const detection = await faceapi
    .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();
  return detection;
};

export const findBestMatch = (
  descriptor: Float32Array,
  storedFaces: any[]
) => {
  let bestMatch = { distance: Infinity, id: null };

  for (const face of storedFaces) {
    // Ensure descriptor is a Float32Array for comparison
    const storedDescriptor = new Float32Array(Object.values(face.descriptor));
    const distance = faceapi.euclideanDistance(descriptor, storedDescriptor);

    if (distance < bestMatch.distance) {
      bestMatch = { distance, id: face.id };
    }
  }

  // Threshold can be adjusted based on desired accuracy
  if (bestMatch.distance < 0.6) {
    return storedFaces.find((face) => face.id === bestMatch.id);
  }

  return null;
};

export const drawLandmarks = (
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    detection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.DetectSingleFaceResult>>
  ) => {
    if (!video || !canvas || !detection) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const { positions } = detection.landmarks;
    const resizedPositions = positions.map(
      pos => new faceapi.Point(
        pos.x * (video.clientWidth / video.videoWidth),
        pos.y * (video.clientHeight / video.videoHeight)
      )
    );
    const resizedLandmarks = new faceapi.FaceLandmarks68(
        resizedPositions,
        { width: video.clientWidth, height: video.clientHeight }
    );


    faceapi.draw.drawFaceLandmarks(canvas, resizedLandmarks);
  };

  export const drawAuthenticatedBox = (
    canvas: HTMLCanvasElement,
    detection: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<faceapi.DetectSingleFaceResult>>,
    message: string
  ) => {
    if (!canvas || !detection) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = detection.landmarks.getNose()[3];
    const { width } = detection.detection.box;
    const radius = width / 2 + 20;

    ctx.strokeStyle = '#00ff80';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = '16px Arial';
    ctx.fillStyle = '#00ff80';
    ctx.fillText(message, x - ctx.measureText(message).width / 2, y - radius - 10);
  };