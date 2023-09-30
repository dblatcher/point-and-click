import { SoundToggle } from "@/components/game-ui/SoundToggle";
import { cloneData } from "@/lib/clone";
import {
  fileToObjectUrl,
  makeDownloadFile,
  uploadFile,
} from "@/lib/files";
import { ServiceItem } from "@/services/Service";
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from "@mui/icons-material/Upload";
import { Alert, Button, Grid, Stack } from "@mui/material";
import { Component, createRef, RefObject } from "react";
import { ServiceItemSelector } from "../ServiceItemSelector";
import PlayCircleOutlineOutlinedIcon from '@mui/icons-material/PlayCircleOutlineOutlined';
import { buildAssetZipBlob, readSoundAssetFromZipFile } from "@/lib/zipFiles";
import soundService from "@/services/soundService"
import {
  SoundAsset,
  soundAssetCategories,
  SoundAssetCategory,
} from "@/services/assets";
import { EditorBox } from "../EditorBox";
import { EditorHeading } from "../EditorHeading";
import { SoundAssetForm } from "./SoundAssetForm";

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
    this.changeValue = this.changeValue.bind(this);

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

    const isNewAsset = asset.id ? soundService.list().includes(asset.id) : true

    return (
      <article>
        <EditorHeading heading="Sound asset tool" />

        <EditorBox title="zip file" boxProps={{ marginBottom: 1 }}>
          <Stack direction={'row'} spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={this.zipSounds}>
              zip all sound assets
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadIcon />}
              onClick={this.loadFromZipFile}>
              load assets from zip file
            </Button>
            {uploadWarning && <Alert severity="error">{uploadWarning}</Alert>}
          </Stack>
        </EditorBox>

        <Grid container spacing={1}>
          <Grid item>
            <ServiceItemSelector
              legend="open asset"
              service={soundService}
              currentSelection={id}
              select={this.openFromService} />
          </Grid>
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
              {(id && soundService.get(id)) && (
                <Button
                  startIcon={<PlayCircleOutlineOutlinedIcon />}
                  sx={{ marginLeft: 1 }}
                  variant="outlined"
                  onClick={() => { soundService.play(id) }}
                >
                  play {id}
                </Button>
              )}

            </EditorBox>

          </Grid>
        </Grid>
      </article>
    );
  }
}
