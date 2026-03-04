import { useUploadImageMutation } from "@apis/images";

interface UploadResponse {
  url: string;
  publicId?: string;
}

export const useUploadFile = () => {
  const [uploadImage, { isLoading }] = useUploadImageMutation();

  const uploadSingleFile = async (
    name: string,
    file: File | null
  ): Promise<UploadResponse> => {
    if (!file) return { url: '' };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('publicId', name);

    return uploadImage(formData).unwrap();
  };

  return { uploadSingleFile, isUploading: isLoading };
};
