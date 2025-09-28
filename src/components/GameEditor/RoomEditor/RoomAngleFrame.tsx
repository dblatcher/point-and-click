import { Box } from "@mui/material"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { ViewAngleSlider } from "./ViewAngleSlider"
import { RoomData } from "@/definitions"

interface Props {
    children: ReactNode;
    roomData: RoomData;
    viewAngleY: number;
    viewAngleX: number;
    setViewAngleY: Dispatch<SetStateAction<number>>;
    setViewAngleX: Dispatch<SetStateAction<number>>;
}


export const RoomAngleFrame = ({ children, roomData, viewAngleX, viewAngleY, setViewAngleX, setViewAngleY }: Props) => {
    return <Box component={'section'} display={'inline-block'}>
        <Box sx={{
            position: 'relative',
            display: 'inline-flex',
        }}>
            <ViewAngleSlider viewAngle={viewAngleY}
                disabled={!roomData.frameHeight || roomData.height === roomData.frameHeight}
                setViewAngle={setViewAngleY}
                forY
                trackLength={'100%'}
                boxProps={{
                    paddingTop: 5
                }}
            />
            {children}
        </Box>

        <ViewAngleSlider
            boxProps={{
                sx: {
                    width: '100%',
                    boxSizing: 'border-box',
                    paddingLeft: 15,
                    paddingRight: 5
                }
            }}
            viewAngle={viewAngleX}
            setViewAngle={setViewAngleX}
            disabled={roomData.width === roomData.frameWidth}
            trackLength={'100%'} />
    </Box>
}