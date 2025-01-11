import type { GameEditorProps } from "@/components/GameEditor"
import dynamic from 'next/dynamic'
import { GameEditorSkeleton } from "./GameEditorSkeleton"



const DynamicComponent = dynamic<GameEditorProps>(() => import('@/components/GameEditor', {}), {
  loading: GameEditorSkeleton,
  ssr: false,
})

export default function EditorLoader(props: GameEditorProps) {
  return <DynamicComponent {...props} />
}