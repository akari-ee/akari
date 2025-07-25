import { useState, useCallback, useEffect } from "react";
import Compressor from "compressorjs";
import imageCompression from "browser-image-compression";

// 워터마크 관련 유틸리티 함수들을 분리
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

async function addWatermarkToImage(
  file: File,
  text = "watermark"
): Promise<File> {
  const [img, canvas] = await imageCompression.drawFileInCanvas(file);
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Canvas context를 가져올 수 없습니다.");
  }

  drawWatermark(context, canvas, text);

  const watermarkedFile = await imageCompression.canvasToFile(
    canvas,
    "image/jpeg",
    file.name,
    file.lastModified,
    1
  );

  return watermarkedFile;
}

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(
    null
  );
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState<string | null>(
    null
  );
  const [shouldAddWatermark, setShouldAddWatermark] = useState<boolean>(true);

  // URL 정리 함수
  const cleanupUrls = useCallback(() => {
    if (originalPreviewUrl) {
      URL.revokeObjectURL(originalPreviewUrl);
    }
    if (processedPreviewUrl) {
      URL.revokeObjectURL(processedPreviewUrl);
    }
  }, [originalPreviewUrl, processedPreviewUrl]);

  // 컴포넌트 언마운트 시 URL 정리
  useEffect(() => {
    return cleanupUrls;
  }, [cleanupUrls]);

  const createPreviewUrl = useCallback(
    (file: File, isProcessed = false) => {
      const url = URL.createObjectURL(file);

      if (isProcessed) {
        // 기존 processed URL이 있다면 정리
        if (processedPreviewUrl) {
          URL.revokeObjectURL(processedPreviewUrl);
        }
        setProcessedPreviewUrl(url);
      } else {
        // 기존 original URL이 있다면 정리
        if (originalPreviewUrl) {
          URL.revokeObjectURL(originalPreviewUrl);
        }
        setOriginalPreviewUrl(url);
      }
    },
    [originalPreviewUrl, processedPreviewUrl]
  );

  const onUpload = async (file: File | Blob) => {
    const formData = new FormData();
    formData.append("file", file, (file as File).name);

    const res = await fetch("/upload", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_UPLOAD_TOKEN}`,
      },
    });

    if (!res.ok) {
      console.log(res);
      throw new Error("Upload Failed!");
    }

    const json = await res.json();
    console.log("Uploaded:", json);
  };

  const handleChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;

      if (!files || !files[0]) return;

      const selectedFile = files[0];
      setFile(selectedFile);

      // 파일 선택 즉시 원본 이미지 미리보기 생성
      createPreviewUrl(selectedFile, false);
    },
    [createPreviewUrl]
  );

  const handleUpload = {
    withBrowserCompression: async () => {
      if (!file) return;

      try {
        let fileToProcess = file;

        // 1. 워터마크 추가 여부에 따라 처리
        if (shouldAddWatermark) {
          fileToProcess = await addWatermarkToImage(file, "텍스트");
          // 워터마크가 추가된 이미지 미리보기 생성
          createPreviewUrl(fileToProcess, true);
        }

        // 2. 이미지 압축 진행
        const compressedFile = await imageCompression(fileToProcess, {
          fileType: "image/jpeg",
          preserveExif: true,
        });

        // 3. 업로드
        await onUpload(compressedFile);
      } catch (error) {
        console.error("업로드 중 오류 발생:", error);
        throw error;
      }
    },

    withCompressor: async () => {
      if (!file) return;

      return new Promise<void>((resolve, reject) => {
        new Compressor(file, {
          quality: 0.8,
          mimeType: "image/jpeg",
          retainExif: true,
          convertSize: 3000000,
          success: async (result: Blob) => {
            try {
              await onUpload(result);
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
            // 워터마크 추가 여부에 따라 조건부 처리
            if (shouldAddWatermark) {
              drawWatermark(context, canvas, "watermark");
            }
          },
        });
      });
    },
  };

  // 현재 표시할 미리보기 URL (처리된 이미지가 있으면 그것을, 없으면 원본을)
  const currentPreviewUrl = processedPreviewUrl || originalPreviewUrl;

  return {
    file,
    originalPreviewUrl,
    processedPreviewUrl,
    currentPreviewUrl,
    shouldAddWatermark,
    setShouldAddWatermark,
    handleChange,
    handleUpload,
    cleanupUrls,
  };
};
