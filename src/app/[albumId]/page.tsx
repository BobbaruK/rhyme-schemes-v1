import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IAlbum } from "@/types/Album";
import { IArtist } from "@/types/Artist";
import { ISong } from "@/types/Song";
import { createClient, EntrySkeletonType } from "contentful";
import Link from "next/link";
import { PiSpeakerNoneFill } from "react-icons/pi";

interface Props {
  params: {
    albumId: string;
  };
}

const Album = async ({ params: { albumId } }: Props) => {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID as unknown as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as unknown as string,
  });

  // Albums
  const albumsResponse = await client.getEntries<
    EntrySkeletonType<IAlbum>,
    string
  >({ content_type: "album" });

  const album = albumsResponse.items.find(
    (album) => album.fields.id === albumId
  );

  // Songs
  const songsResponse = await client.getEntries<
    EntrySkeletonType<ISong>,
    string
  >({ content_type: "song" });

  const songs = songsResponse.items.filter(
    (song) => song.fields.albumId === albumId
  );

  // Artist
  const artistResponse = await client.getEntries<
    EntrySkeletonType<IArtist>,
    string
  >({ content_type: "artist" });

  // const artist = artistResponse.items.find((artist) => {
  //   const firstSong = songs[0].fields as ISong;
  //   return artist.fields.id === firstSong.artistId;
  // });

  // const uno = songs.find((song) => song.fields.trackNo === 1)?.fields.id;

  // console.log("s", uno);

  return (
    <div className="container py-8 flex flex-col gap-4">
      {/* <h1 className="font-bold text-xl sm:text-2xl">{artist?.fields.name}</h1> */}
      <h2 className="text-lg sm:text-xl">
        {album?.fields.name} <small>({album?.fields.year})</small>
      </h2>
      <Accordion type="single" collapsible>
        {songs
          .sort((a, b) => {
            const aTrackNo = a.fields.trackNo as number;
            const bTrackNo = b.fields.trackNo as number;

            if (aTrackNo < bTrackNo) return -1;
            if (aTrackNo > bTrackNo) return 1;
            return 0;
          })
          .map((song, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger>{song.fields.name}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-1">
                <p>
                  <Link
                    href={`/${albumId}/${song.fields.id}`}
                    className={cn(
                      `${buttonVariants({
                        variant: "secondary",
                      })} rounded-full text-xl w-10 h-10 p-0`
                    )}>
                    <PiSpeakerNoneFill className="relative -right-[2px]" />
                  </Link>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </div>
  );
};

export default Album;
