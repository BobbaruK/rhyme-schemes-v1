import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { IAlbum } from "@/types/Album";
import { IAsset } from "@/types/Asset";
import { createClient } from "contentful";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const client = createClient({
    space: process.env.CONTENTFUL_SPACE_ID as unknown as string,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as unknown as string,
  });

  const res = await client.getEntries({ content_type: "album" });

  return (
    <>
      <div className="container py-8 flex gap-4 flex-col">
        {res.items.map((album) => {
          const actualAlbum = album.fields as unknown as IAlbum;
          const albumAsset = res.includes?.Asset as unknown as IAsset[];

          const albumCover = albumAsset.find(
            (asset) => asset.sys.id === actualAlbum.albumArtwork.sys.id
          );

          return (
            <Card
              key={actualAlbum.albumSlug}
              className="flex justify-start items-center overflow-hidden flex-col text-center sm:flex-row sm:text-start">
              <Link href={actualAlbum.albumSlug}>
                <Image
                  src={"https:" + albumCover?.fields.file.url}
                  alt={actualAlbum.albumName}
                  width={albumCover?.fields.file.details.image.width}
                  height={albumCover?.fields.file.details.image.height}
                  className="max-w-full h-auto sm:max-w-[200px] sm:max-h-[150px] object-cover"
                />{" "}
              </Link>
              <CardHeader>
                <CardTitle>
                  <Link href={actualAlbum.albumSlug}>
                    {actualAlbum.albumName}{" "}
                    <small>({actualAlbum.albumYear})</small>
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
