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
import { ServiceItem } from "../../../services/Service";
import { SoundToggle } from "../../../components/SoundToggle";
import styles from "../editorStyles.module.css";

import soundService, {
  SoundAsset,
  SoundAssetCategory,
  soundAssetCategories,

} from "../../../services/soundService";
import { buildAssetZipBlob, readSoundAssetFromZipFile } from "../../../lib/zipFiles";

type State = {
  saveWarning?: string;
  uploadWarning?: string;
  asset: Partial<SoundAsset>;
  fileObjectUrl?: string;
}


export class SoundAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;
  fileRef: RefObject<File>;

  constructor(props: SoundAssetTool["props"]) {
    super(props);
    this.state = {
      asset: {
        id: "NEW_SOUND",
      }
    };
    this.loadFile = this.loadFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipSounds = this.zipSounds.bind(this);

    this.canvasRef = createRef();
    this.fileRef = createRef();
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

  changeValue(propery: keyof SoundAsset, newValue: string | number) {
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
            soundAssetCategories.includes(newValue as SoundAssetCategory)
          ) {
            asset[propery] = newValue as SoundAssetCategory;
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
    const newHref = file ? fileToObjectUrl(file) : undefined

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
    } as SoundAsset
    this.setState({ saveWarning: undefined }, () => {
      soundService.add(copy);
    });
  }

  zipSounds = async () => {
    const result = await buildAssetZipBlob('sounds', soundService);
    if (result.success === false) {
      return this.setState({ saveWarning: result.error });
    }
    makeDownloadFile("sounds.zip", result.blob);
  };

  loadFromZipFile = async () => {
    this.setState({ uploadWarning: undefined });
    const file = await uploadFile();
    if (!file) {
      return;
    }

    const result = await readSoundAssetFromZipFile(file);
    if (result.success === false) {
      return this.setState({ uploadWarning: result.error });
    }
    soundService.add(result.data);
  };

  openFromService(asset: ServiceItem) {
    const assetCopy = cloneData(asset as SoundAsset);
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
    } = asset

    return (
      <article>
        <h2>Sound asset tool</h2>
        <div className={styles.container}>
          <section>
            <ServiceItemSelector
              legend="open asset"
              service={soundService}
              currentSelection={id}
              select={this.openFromService} />

            <fieldset className={styles.fieldset}>
              <div className={styles.row}>
                <button onClick={this.zipSounds}>zip assets</button>
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
              <legend>sound properties</legend>

              <div className={styles.row}>
                <button onClick={this.loadFile}>select sound file</button>
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
                  items={soundAssetCategories}
                  haveEmptyOption={true}
                />
              </div>

              <div className={styles.row}>
                <button onClick={this.saveToService}>Save to service</button>
                {saveWarning && <Warning>{saveWarning}</Warning>}
              </div>
            </fieldset>

            <p>play</p>
            <SoundToggle />
            {(id && soundService.get(id)) && (
              <button onClick={() => { soundService.play(id) }}>play {id}</button>
            )}
          </section>
        </div>
      </article>
    );
  }
}
