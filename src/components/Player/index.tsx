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
import { useParams, useRouter } from "next/navigation";
import { FaPause, FaPlay } from "react-icons/fa";
import { TbPlayerTrackNext, TbPlayerTrackPrev } from "react-icons/tb";
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
  const router = useRouter();

  const { albumId, songId } = useParams<{
    albumId: string;
    songId: string;
  }>();

  const actualSong = songs.find((song) => song.fields.id === songId);
  const actualSongTrackNo = actualSong?.fields.trackNo as unknown as number;

  const getNextSongLink = (action?: "next" | "prev") => {
    const nextSong = songs.find((song) => {
      const songNo = song.fields.trackNo as unknown as number;

      if (action === "prev") return songNo === actualSongTrackNo - 1;

      return songNo === actualSongTrackNo + 1;
    });

    if (!nextSong) return undefined;

    const nextAlbumId = nextSong.fields.albumId as unknown as string;
    const nextSongId = nextSong.fields.id as unknown as string;

    return `/${nextAlbumId}/${nextSongId}`;
  };
  const nextSong = getNextSongLink();
  const prevSong = getNextSongLink("prev");

  const {
    audioPlayer,
    calculateTime,
    changeProgress,
    currentTime,
    duration,
    isPlaying,
    progressBar,
    togglePlayPause,
  } = useAudio({
    whenFinishedTo: getNextSongLink(),
  });

  // console.log(getNextSongLink("prev"), actualSongTrackNo, getNextSongLink());

  return (
    <>
      <div className="flex flex-col gap-4 bg-secondary  p-2 text-secondary-foreground sm:p-4">
        <audio
          ref={audioPlayer}
          // controls
          src={actualSong?.fields.link}
          preload="metadata"
        />
        <div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="order-2 flex grow flex-col gap-2 sm:order-1">
              <div className="flex items-center justify-between gap-4">
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
              <div className="my-auto flex items-center gap-2">
                <Button
                  variant={"default"}
                  onClick={() => router.push(prevSong ? prevSong : "")}
                  disabled={!prevSong}
                  className="h-10 w-10 rounded-full p-1"
                >
                  <TbPlayerTrackPrev size={15} />
                </Button>

                <Button
                  variant={"default"}
                  onClick={togglePlayPause}
                  disabled={!songId}
                  className="h-12 w-12 rounded-full text-lg"
                >
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </Button>

                <Button
                  variant={"default"}
                  onClick={() => router.push(nextSong ? nextSong : "")}
                  disabled={!nextSong}
                  className="h-10 w-10 rounded-full p-1"
                >
                  <TbPlayerTrackNext size={15} />
                </Button>
              </div>
            </div>
            <Image
              src={"https:" + artwork?.fields.file.url}
              alt={artwork ? artwork?.fields.description : ""}
              width={artwork?.fields.file.details.image.width}
              height={artwork?.fields.file.details.image.height}
              className="order-1 h-auto max-w-full object-cover sm:order-2 sm:max-h-[150px] sm:max-w-[200px]"
              priority
            />
          </div>

          <input
            ref={progressBar}
            type="range"
            name={actualSong?.fields.name}
            id={actualSong?.sys.id}
            value={currentTime}
            onChange={changeProgress}
            disabled={!songId}
            className="w-full"
          />
        </div>
        <Tabs
          defaultValue="playlist"
          className="h-full w-full grow overflow-y-auto"
        >
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
