import { FlagMap } from "point-click-lib";

export const flagMap: FlagMap = {
 testFlag : {
    default: false,
    value: true,
    description: 'Whether the flag on the hill has been pushed',
 },
 TestFlag2 : {
    default: false,
    value: false,
 },
 TEST_FLAG_3 : {
    default: true,
    value: true,
 },
}