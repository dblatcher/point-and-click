import JSZip from "jszip";
import { ImageService } from "src/services/imageService";
import { dataToBlob } from "./files";

type ZipBuildFailure = {
  success: false;
  error: string;
};

type ZipBuildSucess = {
  success: true;
  blob: Blob;
};

type ZipBuildResult = ZipBuildFailure | ZipBuildSucess

export const buildImageAssetZip = async (
  imageService: ImageService
): Promise<ZipBuildResult> => {
  const zip = new JSZip();

  const assets = imageService.getAll();
  const assetsBlob = await dataToBlob(
    assets.map((asset) => ({ ...asset, href: "" }))
  );

  if (!assetsBlob) {
    return {
      success: false,
      error: "failed to build assets file",
    };
  }

  zip.file("imageAssets.json", assetsBlob);

  const files = await Promise.all(
    assets.map((asset) => imageService.getFile(asset.id))
  );

  if (files.includes(undefined)) {
    return {
      success: false,
      error: "failed to build all image files",
    };
  }

  (files as File[]).forEach((file) => {
    zip.file(`images/${file.name}`, file);
  });

  const blob = await zip.generateAsync({ type: "blob" });

  return {
    success: true,
    blob,
  };
};
