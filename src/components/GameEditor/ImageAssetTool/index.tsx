import { cloneData } from "@/lib/clone";
import {
  fileToObjectUrl,
  makeDownloadFile,
  uploadFile,
} from "@/lib/files";
import { buildAssetZipBlob, readImageAssetFromZipFile } from "@/lib/zipFiles";
import { ServiceItem } from "@/services/Service";
import {
  ImageAsset,
  ImageAssetCategory,
  imageAssetCategories,
} from "@/services/assets";
import imageService from "@/services/imageService";
import { Grid } from "@mui/material";
import { Component, RefObject, createRef } from "react";
import { EditorHeading } from "../EditorHeading";
import { FileAssetSelector } from "../FileAssetSelector";
import { ZipFileControl } from "../asset-components/ZipFileControl";
import { ImageAssetForm } from "./ImageAssetForm";
import { ImageAssetPreview } from "./ImageAssetPreview";


type State = {
  saveWarning?: string;
  uploadWarning?: string;
  asset: Partial<ImageAsset>;
  fileObjectUrl?: string;
}



export class ImageAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;
  file: File | null;

  constructor(props: ImageAssetTool["props"]) {
    super(props);
    this.state = {
      asset: {
        id: "NEW_IMAGE",
      }
    };
    this.loadFile = this.loadFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipImages = this.zipImages.bind(this);
    this.changeValue = this.changeValue.bind(this);

    this.canvasRef = createRef();
    this.file = null;
  }

  get fullAsset(): ImageAsset {
    return {
      id: '',
      category: 'spriteSheet',
      ...this.state.asset,
      href: this.state.fileObjectUrl || this.state.asset.href || '',
    }
  }

  loadFile = async () => {
    const file = await uploadFile();
    if (!file) {
      return;
    }
    this.file = file
    const newUrl = fileToObjectUrl(file);

    if (this.state.fileObjectUrl && typeof window !== undefined) {
      window.URL.revokeObjectURL(this.state.fileObjectUrl);
    }

    this.setState({
      asset: {
        id: file.name,
        originalFileName: file.name,
      },
      saveWarning: undefined,
      fileObjectUrl: newUrl,
    });
  };

  changeValue(propery: keyof ImageAsset, newValue: string | number | undefined) {
    this.setState(state => {
      const asset = state.asset
      switch (propery) {
        case "id":
          if (typeof newValue === "string") {
            asset[propery] = newValue.toUpperCase();
          }
          break;
        case "category":
          if (
            typeof newValue === "string" &&
            imageAssetCategories.includes(newValue as ImageAssetCategory)
          ) {
            asset[propery] = newValue as ImageAssetCategory;
          }
          break;
        case 'cols':
        case 'rows':
        case 'heightScale':
        case 'widthScale':
          if (typeof newValue === 'number' || typeof newValue === 'undefined') {
            asset[propery] = newValue
          }
          break;
      }

      return {
        saveWarning: undefined,
        asset,
      }
    })
  }

  saveToService() {
    const { asset } = this.state;
    const { file } = this

    // create a new url as the one in state is revoked when
    // a new file is uploaded or a asset retrieved from the service.
    const newHref = file ? fileToObjectUrl(file) : asset.href

    if (!asset.id || !newHref || !asset.category) {
      let saveWarning = ''
      if (!asset.id) {
        saveWarning += "NO ID "
      }
      if (!newHref) {
        saveWarning += "NO FILE "
      }
      if (!asset.category) {
        saveWarning += "NO CATEGORY "
      }
      this.setState({ saveWarning });
      return;
    }

    const copy = {
      ...asset,
      href: newHref
    } as ImageAsset
    this.setState({ saveWarning: undefined }, () => {
      imageService.add(copy);
    });
  }

  zipImages = async () => {
    const result = await buildAssetZipBlob('images', imageService);
    if (result.success === false) {
      return this.setState({ saveWarning: result.error });
    }
    makeDownloadFile("images.zip", result.blob);
  };

  loadFromZipFile = async () => {
    this.setState({ uploadWarning: undefined });
    const file = await uploadFile();
    if (!file) {
      return;
    }

    const result = await readImageAssetFromZipFile(file);
    if (result.success === false) {
      return this.setState({ uploadWarning: result.error });
    }
    imageService.add(result.data);
  };

  openFromService(asset: ServiceItem) {
    const assetCopy = cloneData(asset as ImageAsset);
    this.file = null
    if (this.state.fileObjectUrl && typeof window !== undefined) {
      window.URL.revokeObjectURL(this.state.fileObjectUrl);
    }
    this.setState({
      fileObjectUrl: undefined,
      asset: assetCopy,
    });
  }

  render() {
    const {
      saveWarning,
      uploadWarning,
      asset
    } = this.state;

    const isNewAsset = asset.id ? imageService.list().includes(asset.id) : true

    return (
      <article>
        <EditorHeading heading="Image asset tool" />
        <ZipFileControl
          uploadWarning={uploadWarning}
          zipAssets={this.zipImages}
          loadFromZipFile={this.loadFromZipFile} />

        <Grid container spacing={1}>
          <Grid item>
            <FileAssetSelector
              legend="assets"
              service={imageService}
              currentSelection={asset.id}
              select={this.openFromService} />
          </Grid>

          <Grid item>
            <ImageAssetForm
              imageAsset={asset}
              changeValue={this.changeValue}
              loadFile={this.loadFile}
              isNewAsset={isNewAsset}
              saveAssetChanges={this.saveToService}
              saveWarning={saveWarning}
            />

            <ImageAssetPreview
              imageAsset={this.fullAsset}
              canvasScale={300} />
          </Grid>
        </Grid>

      </article>
    );
  }
}
