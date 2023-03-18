/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Component, createRef, h, RefObject } from "preact";
import {
  fileToObjectUrl,
  makeDownloadFile,
  uploadFile,
} from "../../../lib/files";
import { eventToString } from "../../../lib/util";
import { OptionalNumberInput, SelectInput, TextInput, Warning } from "../formControls";
import { cloneData } from "../../../lib/clone";
import { ServiceItemSelector } from "../ServiceItemSelector";
import { ServiceItem } from "src/services/Service";
import editorStyles from "../editorStyles.module.css";
import imageService, {
  ImageAsset,
  ImageAssetCategory,
  imageAssetCategories,

} from "../../../services/imageService";
import { buildAssetZipBlob, readImageAssetFromZipFile } from "../../../lib/zipFiles";
import { SpriteSheetPreview } from "../SpriteSheetPreview";
import { EditorHeading } from "../EditorHeading";


type State = {
  saveWarning?: string;
  uploadWarning?: string;
  asset: Partial<ImageAsset>;
  fileObjectUrl?: string;
}



export class ImageAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;
  fileRef: RefObject<File>;

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

    this.canvasRef = createRef();
    this.fileRef = createRef();
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
    this.fileRef.current = file
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
    const { current: file } = this.fileRef

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
    this.fileRef.current = null
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

    const {
      id = "",
      category = "",
      rows, cols, widthScale, heightScale
    } = asset

    const saveButtonText = imageService.list().includes(id) ? `UPDATE ${id}` : `ADD NEW ASSET`

    return (
      <article>
        <EditorHeading heading="Image asset tool" />
        <div className={editorStyles.container}>
          <section>
            <ServiceItemSelector
              legend="assets"
              service={imageService}
              currentSelection={id}
              select={this.openFromService} />

            <fieldset className={editorStyles.fieldset}>
              <div className={editorStyles.row}>
                <button onClick={this.zipImages}>zip all image assets</button>
              </div>
              <div className={editorStyles.row}>
                <button onClick={this.loadFromZipFile}>
                  load assets from zip file
                </button>
                {uploadWarning && <Warning>{uploadWarning}</Warning>}
              </div>
            </fieldset>
          </section>

          <section>
            <fieldset className={editorStyles.fieldset}>
              <legend>image properties</legend>

              <div className={editorStyles.row}>
                <button onClick={this.loadFile}>select image file</button>
              </div>
              <div className={editorStyles.row}>
                <TextInput
                  label="ID"
                  value={id}
                  onInput={(event) =>
                    this.changeValue("id", eventToString(event))
                  } />
              </div>
              <div className={editorStyles.row}>
                <SelectInput
                  onSelect={(value) => this.changeValue("category", value)}
                  label="category"
                  value={category}
                  items={imageAssetCategories}
                  haveEmptyOption={true} />
              </div>


              <div className={editorStyles.row}>
                <OptionalNumberInput label="rows" value={rows} min={1}
                  key={`${id}1`}
                  inputHandler={
                    value => { this.changeValue('rows', value) }
                  }
                />
                <OptionalNumberInput label="cols" value={cols} min={1}
                  key={`${id}2`}
                  inputHandler={
                    value => { this.changeValue('cols', value) }
                  }
                />
              </div>
              <div className={editorStyles.row}>
                <OptionalNumberInput label="widthScale" value={widthScale} step={.1}
                  key={`${id}3`}
                  inputHandler={
                    value => { this.changeValue('widthScale', value) }
                  }
                />
                <OptionalNumberInput label="heightScale" value={heightScale} step={.1}
                  key={`${id}4`}
                  inputHandler={
                    value => { this.changeValue('heightScale', value) }
                  }
                />
              </div>


            </fieldset>

            <fieldset className={editorStyles.fieldset}>
              <div className={editorStyles.row}>
                <button onClick={this.saveToService}>{saveButtonText}</button>
                {saveWarning && <Warning>{saveWarning}</Warning>}
              </div>
            </fieldset>

            <p>Resizing the preview does not effect the image data.</p>
            <SpriteSheetPreview
              imageAsset={this.fullAsset}
              canvasScale={300} />

          </section>
        </div>
      </article>
    );
  }
}
