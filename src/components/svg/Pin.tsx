interface PinProps {
    x?: number;
    y?: number;
    label: string;
    pinHeight?: number;
    pinTilt?: number
}
export const Pin = ({ x = 0, y = 0, label, pinHeight = 15, pinTilt = 0 }: PinProps) => {
    return <>
        <line
            x1={x} x2={x + pinTilt} y1={-y} y2={-y - pinHeight}
            stroke={'black'} strokeWidth={1} />
        <circle cx={x + pinTilt} cy={-y - pinHeight} r={6}></circle>
        <text x={x - 2 + pinTilt} y={-y - pinHeight + 2} stroke="none" fill="white" fontSize={8}>{label}</text>
    </>;
};
