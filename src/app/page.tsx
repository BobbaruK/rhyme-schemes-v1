import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { IAlbum } from "@/types/Album";
import { IAsset } from "@/types/Asset";
import { ISong } from "@/types/Song";
import { createClient, EntrySkeletonType } from "contentful";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID as unknown as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as unknown as string,
  });

  const albums = await client.getEntries({ content_type: "album" });

  // Songs
  const songsResponse = await client.getEntries<
    EntrySkeletonType<ISong>,
    string
  >({ content_type: "song" });
  const songs = songsResponse.items;

  const getFirstTrackId = (albumId: string) => {
    const albumSongs = songs.filter((song) => song.fields.albumId === albumId);

    const firstTrack = albumSongs.find((song) => {
      const trackNo = parseInt(song.fields.trackNo);

      return trackNo === 1;
    });

    return firstTrack?.fields.id;
  };

  return (
    <>
      <div className="container py-8 flex gap-4 flex-col">
        {albums.items.map((album) => {
          const actualAlbum = album.fields as unknown as IAlbum;
          const albumAsset = albums.includes?.Asset as unknown as IAsset[];

          const albumCover = albumAsset.find(
            (asset) => asset.sys.id === actualAlbum.artwork.sys.id
          );

          const firstTrackId = getFirstTrackId(actualAlbum.id);

          return (
            <Card
              key={actualAlbum.slug}
              className="flex justify-start items-center overflow-hidden flex-col text-center sm:flex-row sm:text-start">
              <Link href={`/${actualAlbum.slug}/${firstTrackId}`}>
                <Image
                  src={"https:" + albumCover?.fields.file.url}
                  alt={actualAlbum.name}
                  width={albumCover?.fields.file.details.image.width}
                  height={albumCover?.fields.file.details.image.height}
                  className="max-w-full h-auto sm:max-w-[200px] sm:max-h-[150px] object-cover"
                />
              </Link>
              <CardHeader>
                <CardTitle>
                  <Link href={`/${actualAlbum.slug}/${firstTrackId}`}>
                    {actualAlbum.name} <small>({actualAlbum.year})</small>
                  </Link>
                </CardTitle>
              </CardHeader>
            </Card>
          );
        })}
      </div>
    </>
  );
}
