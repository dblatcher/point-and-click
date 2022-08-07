import JSZip from "jszip";
import { GameDesignSchema } from "../../src/definitions/Game";
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

const FILENAMES = {
  game: "game.json",
  imageAssets: "imageAssets.json",
};

const blobToZip = async (blob: Blob): Promise<JSZip | undefined> => {
  return await new JSZip().loadAsync(blob).catch((error) => {
    console.warn(error);
    return undefined;
  });
};

const extractJsonFile = async (
  fileName: string,
  zip: JSZip
): Promise<unknown> => {
  const dataBlob = await zip.file(fileName)?.async("blob");
  const dataString = await dataBlob?.text();

  if (!dataString) {
    throw `could not get data from ${fileName}`;
  }

  try {
    const data = JSON.parse(dataString);
    return data;
  } catch (error) {
    console.warn(error);
    throw `${fileName} was not valid json`;
  }
};

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

  zip.file(FILENAMES.imageAssets, assetsBlob);

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
  const zip = await blobToZip(file);

  if (!zip) {
    return {
      success: false,
      error: `failed to get contents data from  ${file.name}`,
    };
  }

  let data: unknown;
  try {
    data = await extractJsonFile(FILENAMES.imageAssets, zip);
  } catch (error) {
    return {
      success: false,
      error: error as string,
    };
  }

  const results = ImageAssetSchema.array().safeParse(data);

  if (!results.success) {
    console.warn(results.error);
    return {
      success: false,
      error: `data in ${FILENAMES.imageAssets} was not a valid array of imageAssets`,
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
    zip.file(FILENAMES.game, gameDesignBlob);
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

export const readGameFromZipFile = async (
  file: File
): Promise<
  ZipReadResult<{ imageAssets: ImageAsset[]; gameDesign: GameDesign }>
> => {
  const readImageResult = await readImageAssetFromZipFile(file);

  if (!readImageResult.success) {
    return {
        success: false,
        error: readImageResult.error,
      };
  }

  const zip = await blobToZip(file);
  if (!zip) {
    return {
      success: false,
      error: `failed to make zip from ${file.name}`,
    };
  }

  let data: unknown;
  try {
    data = await extractJsonFile(FILENAMES.game, zip);
  } catch (error) {
    return {
      success: false,
      error: error as string,
    };
  }

  const results = GameDesignSchema.safeParse(data);

  if (!results.success) {
    console.warn(results.error);
    return {
      success: false,
      error: `data in ${FILENAMES.game} was not a GameDesign`,
    };
  }

  console.log(results);

  return {
    success: true,
    data : {
        gameDesign: results.data,
        imageAssets: readImageResult.data,
    }
  };
};
