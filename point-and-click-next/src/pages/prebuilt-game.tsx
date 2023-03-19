import Head from 'next/head'
import Link from 'next/link'
import { GameDesignPlayer } from '@/components/GameDesignPlayer'
import { prebuiltGameDesign } from '@/data/fullGame'
import { imageAssets } from '@/data/images'
import { soundAssets } from '@/data/sounds'



export default function GameLoaderPage() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Link href={'/'}>home</Link>
        <GameDesignPlayer
          gameDesign={prebuiltGameDesign}
          imageAssets={imageAssets}
          soundAssets={soundAssets}
        />
      </main>
    </>
  )
}
