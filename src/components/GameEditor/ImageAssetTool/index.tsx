/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, createRef, h, RefObject } from "preact";
import {
  fileToImageUrl,
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
import { buildImageAssetZip, readImageAssetZip } from "../../../lib/zipFiles";

type ExtraState = {
  urlIsObjectUrl: boolean;
  saveWarning?: string;
  uploadWarning?: string;
};

type State = Partial<ImageAsset> & ExtraState;

export class ImageAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;

  constructor(props: ImageAssetTool["props"]) {
    super(props);
    this.state = {
      urlIsObjectUrl: false,
      id: "NEW_IMAGE",
    };
    this.loadFile = this.loadFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipImages = this.zipImages.bind(this);

    this.canvasRef = createRef();
  }

  loadFile = async () => {
    const { urlIsObjectUrl, href: oldHref } = this.state;
    const file = await uploadFile();
    if (!file) {
      return;
    }
    const newUrl = fileToImageUrl(file);

    if (oldHref && urlIsObjectUrl && typeof window !== undefined) {
      window.URL.revokeObjectURL(oldHref);
    }

    this.setState({
      href: newUrl,
      urlIsObjectUrl: true,
      id: file.name,
      saveWarning: undefined,
      originalFileName: file.name,
    });
  };

  changeValue(propery: keyof ImageAsset, newValue: string | number) {
    const modification: Partial<State> = {
      saveWarning: undefined,
    };
    switch (propery) {
      case "id":
        if (typeof newValue === "string") {
          modification[propery] = newValue.toUpperCase();
        }
        break;
      case "category":
        if (
          typeof newValue === "string" &&
          imageAssetCategories.includes(newValue as ImageAssetCategory)
        ) {
          modification[propery] = newValue as ImageAssetCategory;
        }
        break;
    }
    this.setState(modification);
  }

  saveToService() {
    const { state } = this;

    if (!state.id) {
      this.setState({ saveWarning: "NO ID" });
      return;
    }
    if (!state.href) {
      this.setState({ saveWarning: "NO FILE" });
      return;
    }
    if (!state.category) {
      this.setState({ saveWarning: "NO CATEGORY" });
      return;
    }

    const copy = cloneData(state) as ImageAsset & Partial<ExtraState>;
    delete copy.urlIsObjectUrl;
    delete copy.saveWarning;
    delete copy.uploadWarning;

    this.setState({ saveWarning: undefined }, () => {
      imageService.add(copy);
    });
  }

  zipImages = async () => {
    const result = await buildImageAssetZip(imageService);
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

    const result = await readImageAssetZip(file);
    if (result.success === false) {
      return this.setState({ uploadWarning: result.error });
    }
    imageService.add(result.data);
  };

  openFromService(asset: ServiceItem) {
    const copy = cloneData(asset as ImageAsset);
    this.setState((state) => {
      const newState = {
        ...state,
        ...copy,
      };
      newState.originalFileName = copy.originalFileName;
      return newState;
    });
  }

  render() {
    const {
      href,
      id = "",
      saveWarning,
      category = "",
      uploadWarning,
    } = this.state;

    return (
      <article>
        <h2>Image asset tool</h2>
        <div className={styles.container}>
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
                  }
                />
              </div>
              <div className={styles.row}>
                <SelectInput
                  onSelect={(value) => this.changeValue("category", value)}
                  label="category"
                  value={category}
                  items={imageAssetCategories}
                  haveEmptyOption={true}
                />
              </div>
            </fieldset>

            <fieldset className={styles.fieldset}>
              <div className={styles.row}>
                <button onClick={this.saveToService}>Save to service</button>
                {saveWarning && <Warning>{saveWarning}</Warning>}
              </div>

              <div className={styles.row}>
                <button onClick={this.zipImages}>zip assets</button>
              </div>
              <div className={styles.row}>
                <button onClick={this.loadFromZipFile}>
                  load assets from zip file
                </button>
                {uploadWarning && <Warning>{uploadWarning}</Warning>}
              </div>
            </fieldset>
            <ServiceItemSelector
              legend="open asset"
              service={imageService}
              select={this.openFromService}
            />
          </section>
          <section>
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
