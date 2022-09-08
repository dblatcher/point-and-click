/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, createRef, h, RefObject } from "preact";
import {
  fileToObjectUrl,
  makeDownloadFile,
  uploadFile,
} from "../../../lib/files";
import { eventToString } from "../../../lib/util";
import { SelectInput, TextInput, Warning } from "../formControls";
import { cloneData } from "../../../lib/clone";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { ServiceItem } from "src/services/Service";
import styles from "../editorStyles.module.css";
import imageService, {
  ImageAsset,
  ImageAssetCategory,
  imageAssetCategories,

} from "../../../services/imageService";
import { buildAssetZipBlob, readImageAssetFromZipFile } from "../../../lib/zipFiles";


type State = {
  urlIsObjectUrl: boolean;
  saveWarning?: string;
  uploadWarning?: string;
  asset: Partial<ImageAsset>;
}



export class ImageAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;

  constructor(props: ImageAssetTool["props"]) {
    super(props);
    this.state = {
      urlIsObjectUrl: false,
      asset: {
        id: "NEW_IMAGE",
      }
    };
    this.loadFile = this.loadFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipImages = this.zipImages.bind(this);

    this.canvasRef = createRef();
  }

  loadFile = async () => {
    const { urlIsObjectUrl, asset } = this.state;
    const { href: oldHref } = asset;

    const file = await uploadFile();
    if (!file) {
      return;
    }
    const newUrl = fileToObjectUrl(file);

    if (oldHref && urlIsObjectUrl && typeof window !== undefined) {
      window.URL.revokeObjectURL(oldHref);
    }

    this.setState({
      asset: {
        href: newUrl,
        id: file.name,
        originalFileName: file.name,
      },
      urlIsObjectUrl: true,
      saveWarning: undefined,
    });
  };

  changeValue(propery: keyof ImageAsset, newValue: string | number) {

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
      }

      return {
        saveWarning: undefined,
        asset,
      }
    })

  }

  saveToService() {
    const { asset } = this.state;

    if (!asset.id || !asset.href || !asset.category) {
      let saveWarning = ''
      if (!asset.id) {
        saveWarning += "NO ID "
      }
      if (!asset.href) {
        saveWarning += "NO FILE "
      }
      if (!asset.category) {
        saveWarning += "NO CATEGORY "
      }
      this.setState({ saveWarning });
      return;
    }

    const copy = {
      ...asset
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
    this.setState((state) => {
      const newState = {
        ...state,
        asset: assetCopy,
      };
      newState.asset.originalFileName = assetCopy.originalFileName;
      return newState;
    });
  }

  render() {
    const {
      saveWarning,
      uploadWarning,
      asset
    } = this.state;

    const {
      href,
      id = "",
      category = "",
    } = asset

    const saveButtonText = imageService.list().includes(id) ? `UPDATE ${id}` : `ADD NEW ASSET`

    return (
      <article>
        <h2>Image asset tool</h2>
        <div className={styles.container}>
          <section>
            <ServiceItemSelector
              legend="assets"
              service={imageService}
              select={this.openFromService} />

            <fieldset className={styles.fieldset}>
              <div className={styles.row}>
                <button onClick={this.zipImages}>zip all image assets</button>
              </div>
              <div className={styles.row}>
                <button onClick={this.loadFromZipFile}>
                  load assets from zip file
                </button>
                {uploadWarning && <Warning>{uploadWarning}</Warning>}
              </div>
            </fieldset>
          </section>

          <section>
            <fieldset className={styles.fieldset}>
              <legend>image properties</legend>

              <div className={styles.row}>
                <button onClick={this.loadFile}>select image file</button>
              </div>
              <div className={styles.row}>
                <TextInput
                  label="ID"
                  value={id}
                  onInput={(event) =>
                    this.changeValue("id", eventToString(event))
                  } />
              </div>
              <div className={styles.row}>
                <SelectInput
                  onSelect={(value) => this.changeValue("category", value)}
                  label="category"
                  value={category}
                  items={imageAssetCategories}
                  haveEmptyOption={true} />
              </div>
              <div className={styles.row}>
                <button onClick={this.saveToService}>{saveButtonText}</button>
                {saveWarning && <Warning>{saveWarning}</Warning>}
              </div>
            </fieldset>

            <p>Resizing the preview does not effect the image data.</p>
            <div className={styles.spriteSheetPreview}>
              <img src={href} />
            </div>
          </section>
        </div>
      </article>
    );
  }
}
