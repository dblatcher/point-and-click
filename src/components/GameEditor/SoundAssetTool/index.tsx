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

type ExtraState = {
  urlIsObjectUrl: boolean;
  saveWarning?: string;
  uploadWarning?: string;
};

type State = Partial<SoundAsset> & ExtraState;

export class SoundAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;

  constructor(props: SoundAssetTool["props"]) {
    super(props);
    this.state = {
      urlIsObjectUrl: false,
      id: "NEW_SOUND",
    };
    this.loadFile = this.loadFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipSounds = this.zipSounds.bind(this);

    this.canvasRef = createRef();
  }

  loadFile = async () => {
    const { urlIsObjectUrl, href: oldHref } = this.state;
    const file = await uploadFile();
    if (!file) {
      return;
    }
    const newUrl = fileToObjectUrl(file);

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

  changeValue(propery: keyof SoundAsset, newValue: string | number) {
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
          soundAssetCategories.includes(newValue as SoundAssetCategory)
        ) {
          modification[propery] = newValue as SoundAssetCategory;
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

    const copy = cloneData(state) as SoundAsset & Partial<ExtraState>;
    delete copy.urlIsObjectUrl;
    delete copy.saveWarning;
    delete copy.uploadWarning;

    this.setState({ saveWarning: undefined }, () => {
      soundService.add(copy);
    });
  }

  zipSounds = async () => {
    const result = await buildAssetZipBlob('sounds',soundService);
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
    const copy = cloneData(asset as SoundAsset);
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
        <h2>Sound asset tool</h2>
        <div className={styles.container}>
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
            </fieldset>

            <fieldset className={styles.fieldset}>
              <div className={styles.row}>
                <button onClick={this.saveToService}>Save to service</button>
                {saveWarning && <Warning>{saveWarning}</Warning>}
              </div>

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
            <ServiceItemSelector
              legend="open asset"
              service={soundService}
              select={this.openFromService}
            />
          </section>

          <section>
            {href && (
              <p>{this.state.originalFileName} : {href}</p>

            )}
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
