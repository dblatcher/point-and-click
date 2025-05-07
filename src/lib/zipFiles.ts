import { assetToFile, ImageAsset, ImageAssetSchema, SoundAsset, SoundAssetSchema, } from "@/services/assets";
import { ImageService } from "@/services/imageService";
import { SoundService } from "@/services/soundService";
import JSZip from "jszip";
import { GameDesign } from "../definitions";
import { parseAndUpgrade } from "./design-version-management";
import { dataToBlob, fileToObjectUrl } from "./files";
import { DB_VERSION } from "./indexed-db";

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
  images: "imageAssets.json",
  sounds: "soundAssets.json",
} as const;

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

const prepareAssetZipFromService = async (
  type: 'images' | 'sounds',
  service: ImageService | SoundService,
  existingZip?: JSZip,
): Promise<JSZip> => {
  const zip = existingZip || new JSZip();
  const assets = service.getAll();
  const assetsBlob = await dataToBlob(
    assets.map((asset) => ({ ...asset, href: "" }))
  );

  if (!assetsBlob) {
    throw "failed to build assets file";
  }

  zip.file(FILENAMES[type], assetsBlob);

  const files = await Promise.all(
    assets.map(assetToFile)
  );

  if (files.includes(undefined)) {
    throw `failed to build all asset(${type}) files`;
  }

  (files as File[]).forEach((file) => {
    zip.file(`${type}/${file.name}`, file);
  });

  return zip;
};

const prepareAssetZipFromAssets = async(
  type: 'images' | 'sounds',
  assets: ImageAsset[] | SoundAsset[],
  existingZip?: JSZip,
) => {
  const zip = existingZip || new JSZip();
  const assetsBlob = await dataToBlob(
    assets.map((asset) => ({ ...asset, href: "" }))
  );

  if (!assetsBlob) {
    throw "failed to build assets file";
  }

  zip.file(FILENAMES[type], assetsBlob);

  const files = await Promise.all(
    assets.map(assetToFile)
  );

  if (files.includes(undefined)) {
    throw `failed to build all asset(${type}) files`;
  }

  (files as File[]).forEach((file) => {
    zip.file(`${type}/${file.name}`, file);
  });

  return zip;
}

export const buildAssetZipBlob = async (
  type: 'images' | 'sounds',
  service: ImageService | SoundService
): Promise<ZipBuildResult> => {
  try {
    const zip = await prepareAssetZipFromService(type, service);
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
  file: Blob
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
    data = await extractJsonFile(FILENAMES.images, zip);
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
      error: `data in ${FILENAMES.images} was not a valid array of imageAssets`,
    };
  }

  async function populateHref(asset: ImageAsset): Promise<ImageAsset> {
    const imageBlob = await zip?.file(`images/${asset.id}`)?.async("blob");
    if (!imageBlob) {
      console.warn("MISSING FILE", `images/${asset.id}`);
      return asset;
    }
    const imageUrl = fileToObjectUrl(imageBlob);
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

export const readSoundAssetFromZipFile = async (
  file: Blob
): Promise<ZipReadResult<SoundAsset[]>> => {
  const zip = await blobToZip(file);

  if (!zip) {
    return {
      success: false,
      error: `failed to get contents data from  ${file.name}`,
    };
  }

  let data: unknown;
  try {
    data = await extractJsonFile(FILENAMES.sounds, zip);
  } catch (error) {
    return {
      success: false,
      error: error as string,
    };
  }

  const results = SoundAssetSchema.array().safeParse(data);

  if (!results.success) {
    console.warn(results.error);
    return {
      success: false,
      error: `data in ${FILENAMES.sounds} was not a valid array of soundAssets`,
    };
  }

  async function populateHref(asset: SoundAsset): Promise<SoundAsset> {
    const assetBlob = await zip?.file(`sounds/${asset.id}`)?.async("blob");
    if (!assetBlob) {
      console.warn("MISSING FILE", `sounds/${asset.id}`);
      return asset;
    }
    const objectUrl = fileToObjectUrl(assetBlob);
    if (!objectUrl) {
      console.warn("object url failed", `sounds/${asset.id}`);
      return asset;
    }
    asset.href = objectUrl;
    return asset;
  }

  const populatedAssets = await Promise.all(results.data.map(populateHref));

  return {
    success: true,
    data: populatedAssets,
  };
};

const prepareGameDataZip = async (
  gameDesign: GameDesign,
  existingZip?: JSZip,
): Promise<JSZip> => {
  const zip = existingZip || new JSZip();
  const gameDesignBlob = dataToBlob(gameDesign);
  if (!gameDesignBlob) {
    throw "failed to make gameDesignBlob";
  }
  zip.file(FILENAMES.game, gameDesignBlob);

  return zip
}

export const buildGameZipBlob = async (
  gameDesign: GameDesign,
  imageService: ImageService,
  soundService: SoundService,
): Promise<ZipBuildResult> => {
  try {
    const zip = new JSZip()
    await prepareAssetZipFromService('images', imageService, zip)
    await prepareAssetZipFromService('sounds', soundService, zip)
    await prepareGameDataZip(gameDesign, zip)

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
  file: Blob
): Promise<
  ZipReadResult<{
    gameDesign: GameDesign;
    imageAssets: ImageAsset[];
    soundAssets: SoundAsset[];
  }>
> => {
  const readImageResult = await readImageAssetFromZipFile(file);
  if (!readImageResult.success) {
    return {
      success: false,
      error: readImageResult.error,
    };
  }

  const readSoundResult = await readSoundAssetFromZipFile(file);
  if (!readSoundResult.success) {
    return {
      success: false,
      error: readSoundResult.error,
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

  const {design, message} = parseAndUpgrade(data, DB_VERSION);

  if (!design) {
    console.warn(message);
    return {
      success: false,
      error: `data in ${FILENAMES.game} was not a GameDesign`,
    };
  }

  return {
    success: true,
    data: {
      gameDesign: design,
      imageAssets: readImageResult.data,
      soundAssets: readSoundResult.data,
    }
  };
};


export const buildGameZipBlobFromAssets =async (
  gameDesign: GameDesign,
  imageAssets: ImageAsset[],
  soundAssets: SoundAsset[],
): Promise<ZipBuildResult> => {
  try {
    const zip = new JSZip()
    await prepareAssetZipFromAssets('images', imageAssets, zip)
    await prepareAssetZipFromAssets('sounds', soundAssets, zip)
    await prepareGameDataZip(gameDesign, zip)

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
}
