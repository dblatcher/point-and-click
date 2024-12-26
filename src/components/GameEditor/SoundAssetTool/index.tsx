import { cloneData } from "@/lib/clone";
import {
  fileToObjectUrl,
  makeDownloadFile,
  uploadFile,
  urlToBlob,
} from "@/lib/files";
import { buildAssetZipBlob, readSoundAssetFromZipFile } from "@/lib/zipFiles";
import { ServiceItem } from "@/services/Service";
import {
  SoundAsset,
  SoundAssetCategory,
  soundAssetCategories,
} from "@/services/assets";
import { SoundService } from "@/services/soundService";
import { Grid } from "@mui/material";
import { Component, RefObject, createRef } from "react";
import { FileAssetSelector } from "../FileAssetSelector";
import { EditorHeading } from "../EditorHeading";
import { ZipFileControl } from "../asset-components/ZipFileControl";
import { SoundAssetForm } from "./SoundAssetForm";
import { SoundPreview } from "./SoundPreview";

type State = {
  saveWarning?: string;
  uploadWarning?: string;
  asset: Partial<SoundAsset>;
  fileObjectUrl?: string;
}

type Props = {
  soundService: SoundService
}


export class SoundAssetTool extends Component<Props, State> {
  canvasRef: RefObject<HTMLCanvasElement>;
  file: File | Blob | null;

  constructor(props: Props) {
    super(props);
    this.state = {
      asset: {
        id: "NEW_SOUND",
      }
    };
    this.loadFile = this.loadFile.bind(this);
    this.loadUrl = this.loadUrl.bind(this);
    this.loadFromZipFile = this.loadFromZipFile.bind(this);
    this.saveToService = this.saveToService.bind(this);
    this.openFromService = this.openFromService.bind(this);
    this.zipSounds = this.zipSounds.bind(this);
    this.changeValue = this.changeValue.bind(this);
    this.clearForm = this.clearForm.bind(this)

    this.canvasRef = createRef();
    this.file = null;
  }

  setNewFile(file: Blob | File) {
    this.file = file
    const newUrl = fileToObjectUrl(file);

    if (this.state.fileObjectUrl && typeof window !== undefined) {
      window.URL.revokeObjectURL(this.state.fileObjectUrl);
    }

    this.setState({
      asset: {
        id: file.name ?? this.state.asset.id,
        originalFileName: file.name,
      },
      saveWarning: undefined,
      fileObjectUrl: newUrl,
    });
  }

  loadFile = async () => {
    const file = await uploadFile();
    if (!file) {
      this.setState({ uploadWarning: 'failed to upload image file' })
      return;
    }
    this.setNewFile(file)
  };

  loadUrl = async (url: string) => {
    const { blob, failure } = await urlToBlob(url, 'audio')
    if (!blob) {
      this.setState({ uploadWarning: `failed to load sound URL: ${failure ?? ''}` })
      return
    }
    this.setNewFile(blob)
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
      this.props.soundService.add(copy);
    });
  }

  zipSounds = async () => {
    const result = await buildAssetZipBlob('sounds', this.props.soundService);
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
    this.props.soundService.add(result.data);
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

    const isNewAsset = asset.id ? !this.props.soundService.list().includes(asset.id) : true

    return (
      <article>
        <EditorHeading heading="Sound asset tool" />
        <ZipFileControl
          clearForm={this.clearForm}
          clearWarning={() => this.setState({ uploadWarning: undefined })}
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
              loadUrl={this.loadUrl}
              hasFile={!!this.state.fileObjectUrl}
            />
            <SoundPreview
              asset={this.state.asset}
              temporaryFileName={this.state.asset.originalFileName}
              temporarySrc={this.state.fileObjectUrl} />
          </Grid>

          <Grid item>
            <FileAssetSelector
              legend="open asset"
              assetType="sound"
              currentSelection={asset.id}
              select={this.openFromService} />
          </Grid>
        </Grid>
      </article>
    );
  }
}
