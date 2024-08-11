import { SoundToggle } from "@/components/game-ui/SoundToggle";
import { cloneData } from "@/lib/clone";
import {
  fileToObjectUrl,
  makeDownloadFile,
  uploadFile,
} from "@/lib/files";
import { buildAssetZipBlob, readSoundAssetFromZipFile } from "@/lib/zipFiles";
import { ServiceItem } from "@/services/Service";
import {
  SoundAsset,
  SoundAssetCategory,
  soundAssetCategories,
} from "@/services/assets";
import soundService from "@/services/soundService";
import { Button, Grid } from "@mui/material";
import { Component, RefObject, createRef } from "react";
import { EditorBox } from "../EditorBox";
import { EditorHeading } from "../EditorHeading";
import { FileAssetSelector } from "../FileAssetSelector";
import { ZipFileControl } from "../asset-components/ZipFileControl";
import { SoundAssetForm } from "./SoundAssetForm";
import { PlayCircleOutlineOutlinedIcon } from "../material-icons";

type State = {
  saveWarning?: string;
  uploadWarning?: string;
  asset: Partial<SoundAsset>;
  fileObjectUrl?: string;
}


export class SoundAssetTool extends Component<{}, State> {
  canvasRef: RefObject<HTMLCanvasElement>;
  file: File | null;

  constructor(props: SoundAssetTool["props"]) {
    super(props);
    this.state = {
      asset: {
        id: "NEW_SOUND",
      }
    };
    this.loadFile = this.loadFile.bind(this);
    this.loadFromZipFile = this.loadFromZipFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipSounds = this.zipSounds.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.clearForm = this.clearForm.bind(this)

    this.canvasRef = createRef();
    this.file = null;
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

  clearForm() {
    if (this.state.fileObjectUrl && typeof window !== undefined) {
      window.URL.revokeObjectURL(this.state.fileObjectUrl);
    }
    this.file = null
    this.setState({
      asset: { id: '' },
      fileObjectUrl: undefined,
    })
  }

  changeValue(propery: keyof SoundAsset, newValue: string | number | undefined) {
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
    const file = this.file

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

    const isNewAsset = asset.id ? !soundService.list().includes(asset.id) : true

    return (
      <article>
        <EditorHeading heading="Sound asset tool" />
        <ZipFileControl
          clearForm={this.clearForm}
          uploadWarning={uploadWarning}
          zipAssets={this.zipSounds}
          loadFromZipFile={this.loadFromZipFile} />

        <Grid container spacing={1} justifyContent={'space-between'}>
          <Grid item>
            <SoundAssetForm
              soundAsset={asset}
              changeValue={this.changeValue}
              loadFile={this.loadFile}
              isNewAsset={isNewAsset}
              saveAssetChanges={this.saveToService}
              saveWarning={saveWarning}
            />
            <EditorBox title="play sound">
              <SoundToggle />
              {(asset.id && soundService.get(asset.id)) && (
                <Button
                  startIcon={<PlayCircleOutlineOutlinedIcon />}
                  sx={{ marginLeft: 1 }}
                  variant="outlined"
                  onClick={() => { soundService.play(asset.id ?? '') }}
                >
                  play {asset.id}
                </Button>
              )}
            </EditorBox>
          </Grid>

          <Grid item>
            <FileAssetSelector
              legend="open asset"
              service={soundService}
              currentSelection={asset.id}
              select={this.openFromService} />
          </Grid>
        </Grid>
      </article>
    );
  }
}
