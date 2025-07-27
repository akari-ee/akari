import Compressor from "compressorjs";

const drawWatermark = (
  context: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  text: string
) => {
  const fontSize = Math.floor(canvas.height / 25);
  context.font = `${fontSize}px sans-serif`;
  context.textBaseline = "middle";
  context.textAlign = "center";

  const textMetrics = context.measureText(text);
  const padding = fontSize * 0.2;
  const boxWidth = textMetrics.width + padding * 2;
  const boxHeight = fontSize + padding * 2;

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 흰색 배경 박스 그리기
  context.fillStyle = "white";
  context.fillRect(
    centerX - boxWidth / 2,
    centerY - boxHeight / 2,
    boxWidth,
    boxHeight
  );

  // 검은색 텍스트 그리기
  context.fillStyle = "black";
  context.fillText(text, centerX, centerY);
};

export const compressImage = async ({
  file,
  uploadCallback,
  watermark: { isWatermarkEnabled, text = "watermark" },
}: {
  file: File;
  uploadCallback: (data: Blob) => Promise<void>;
  watermark: { isWatermarkEnabled: boolean; text?: string };
}) => {
  if (!file) return;

  return new Promise<void>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      mimeType: "image/jpeg",
      retainExif: true,
      convertSize: 3000000,
      success: async (result: Blob) => {
        try {
          await uploadCallback(result);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      error: (error) => {
        console.error("압축 중 오류 발생:", error);
        reject(error);
      },
      drew(context, canvas) {
        if (isWatermarkEnabled) drawWatermark(context, canvas, text);
      },
    });
  });
};
