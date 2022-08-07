import JSZip from "jszip";
import { GameDesign } from "../../src";
import {
  ImageAsset,
  ImageAssetSchema,
  ImageService,
} from "../services/imageService";
import { dataToBlob, fileToImageUrl } from "./files";

type ZipActionFailure = {
  success: false;
  error: string;
};

type ZipBuildSucess = {
  success: true;
  blob: Blob;
};

type ZipReadSucess<T> = {
  success: true;
  data: T;
};

type ZipBuildResult = ZipActionFailure | ZipBuildSucess;
type ZipReadResult<T> = ZipActionFailure | ZipReadSucess<T>;

const prepareImageAssetZip = async (
  imageService: ImageService
): Promise<JSZip> => {
  const zip = new JSZip();

  const assets = imageService.getAll();
  const assetsBlob = await dataToBlob(
    assets.map((asset) => ({ ...asset, href: "" }))
  );

  if (!assetsBlob) {
    throw "failed to build assets file";
  }

  zip.file("imageAssets.json", assetsBlob);

  const files = await Promise.all(
    assets.map((asset) => imageService.getFile(asset.id))
  );

  if (files.includes(undefined)) {
    throw "failed to build all image files";
  }

  (files as File[]).forEach((file) => {
    zip.file(`images/${file.name}`, file);
  });

  return zip;
};

export const buildImageAssetZipBlob = async (
  imageService: ImageService
): Promise<ZipBuildResult> => {
  try {
    const zip = await prepareImageAssetZip(imageService);
    const blob = await zip.generateAsync({ type: "blob" });
    return {
      success: true,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      error: error as string,
    };
  }
};

export const readImageAssetFromZipFile = async (
  file: File
): Promise<ZipReadResult<ImageAsset[]>> => {
  const zip = await new JSZip().loadAsync(file).catch((error) => {
    console.warn(error);
    return undefined;
  });

  if (!zip) {
    return {
      success: false,
      error: `failed to get contents data from  ${file.name}`,
    };
  }

  const dataBlob = await zip.file("imageAssets.json")?.async("blob");
  const dataString = await dataBlob?.text();

  if (!dataString) {
    return {
      success: false,
      error: `could not get data from imagesAssets.json`,
    };
  }

  let data: unknown;
  try {
    data = JSON.parse(dataString);
  } catch (error) {
    console.warn(error);
    return { success: false, error: `imagesAssets.json was not valid json` };
  }

  const results = ImageAssetSchema.array().safeParse(data);

  if (!results.success) {
    console.warn(results.error);
    return {
      success: false,
      error: `data in imagesAssets.json was not a valid array of imageAssets`,
    };
  }

  async function populateHref(asset: ImageAsset): Promise<ImageAsset> {
    const imageBlob = await zip?.file(`images/${asset.id}`)?.async("blob");
    if (!imageBlob) {
      console.warn("MISSING FILE", `images/${asset.id}`);
      return asset;
    }
    const imageUrl = fileToImageUrl(imageBlob);
    if (!imageUrl) {
      console.warn("image url failed", `images/${asset.id}`);
      return asset;
    }
    asset.href = imageUrl;
    return asset;
  }

  const populatedAssets = await Promise.all(results.data.map(populateHref));

  return {
    success: true,
    data: populatedAssets,
  };
};

export const buildGameZipBlob = async (
  gameDesign: GameDesign,
  imageService: ImageService
): Promise<ZipBuildResult> => {
  try {
    const zip = await prepareImageAssetZip(imageService);
    const gameDesignBlob = dataToBlob(gameDesign);
    if (!gameDesignBlob) {
      throw "failed to make gameDesignBlob";
    }
    zip.file("game.json", gameDesignBlob);
    const blob = await zip.generateAsync({ type: "blob" });
    return {
      success: true,
      blob,
    };
  } catch (error) {
    return {
      success: false,
      error: error as string,
    };
  }
};
