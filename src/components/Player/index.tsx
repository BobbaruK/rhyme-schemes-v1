"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAudio } from "@/hooks/Audio";
import { IAlbum } from "@/types/Album";
import { IArtist } from "@/types/Artist";
import { IAsset } from "@/types/Asset";
import { ISong } from "@/types/Song";
import { Entry, EntrySkeletonType } from "contentful";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaPause, FaPlay } from "react-icons/fa";
import { Button } from "../ui/button";
import DetailsTab from "./DetailsTab";
import PlaylistTab from "./PlaylistTab";

interface Props {
  album: IAlbum;
  artists: Entry<EntrySkeletonType<IArtist>, undefined, string>[];
  band: IArtist;
  artwork: IAsset | undefined;
  songs: Entry<EntrySkeletonType<ISong>, undefined, string>[];
}

const Player = ({ album, artists, band, artwork, songs }: Props) => {
  const { albumId, songId } = useParams<{
    albumId: string;
    songId: string;
  }>();

  const {
    audioPlayer,
    calculateTime,
    changeProgress,
    currentTime,
    duration,
    isPlaying,
    progressBar,
    togglePlayPause,
  } = useAudio();

  const actualSong = songs.find((song) => song.fields.id === songId);

  return (
    <>
      <div className="bg-secondary text-secondary-foreground p-2 sm:p-4  flex flex-col gap-4">
        <audio
          ref={audioPlayer}
          // controls
          src={actualSong?.fields.link}
          preload="metadata"
        />
        <div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="order-2 sm:order-1 grow flex flex-col gap-2">
              <div className="flex justify-between items-center gap-4">
                <h1 className="">
                  {band.name} - {actualSong?.fields.name}
                </h1>
                <div className="min-w-[110px] text-end">
                  {calculateTime(currentTime)} /{" "}
                  {isNaN(duration) ? "00:00" : calculateTime(duration)}
                </div>
              </div>
              <h2 className="font-bold">
                <Link href={`/${albumId}`}>
                  {album.name} <small>({album.year})</small>
                </Link>
              </h2>
              <div className="flex my-auto">
                <Button
                  variant={"default"}
                  onClick={togglePlayPause}
                  disabled={!songId}
                  className="rounded-full w-12 h-12 text-lg">
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>
              </div>
            </div>
            <Image
              src={"https:" + artwork?.fields.file.url}
              alt={artwork ? artwork?.fields.description : ""}
              width={artwork?.fields.file.details.image.width}
              height={artwork?.fields.file.details.image.height}
              className="max-w-full h-auto sm:max-w-[200px] sm:max-h-[150px] object-cover order-1 sm:order-2"
            />
          </div>

          <input
            ref={progressBar}
            type="range"
            name={actualSong?.sys.id}
            id={actualSong?.sys.id}
            value={currentTime}
            onChange={changeProgress}
            disabled={!songId}
            className="w-full"
          />
        </div>
        <Tabs
          defaultValue="playlist"
          className="w-full grow h-full overflow-y-auto">
          <TabsList>
            <TabsTrigger value="playlist">Playlist</TabsTrigger>
            <TabsTrigger value="detalii">Detalii</TabsTrigger>
            <TabsTrigger value="lirica">Lirica</TabsTrigger>
          </TabsList>
          <div className="h-[550px] overflow-y-auto">
            <TabsContent value="playlist">
              <PlaylistTab songs={songs} />
            </TabsContent>
            <TabsContent value="detalii">
              <DetailsTab
                actualSong={actualSong}
                artists={artists}
                album={album}
              />
            </TabsContent>
            <TabsContent value="lirica">lirica here</TabsContent>
          </div>
        </Tabs>
      </div>
    </>
  );
};

export default Player;
