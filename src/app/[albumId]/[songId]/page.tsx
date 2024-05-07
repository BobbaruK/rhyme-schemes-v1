import Player from "@/components/Player";
import { IAlbum } from "@/types/Album";
import { IArtist } from "@/types/Artist";
import { IAsset } from "@/types/Asset";
import { ISong } from "@/types/Song";
import { createClient, EntrySkeletonType } from "contentful";

interface Props {
  params: {
    albumId: string;
    songId: string;
  };
}

const Song = async ({ params: { songId, albumId } }: Props) => {
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

  const albumFields = album?.fields as IAlbum;

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

  const artist = artistResponse.items.find(
    (artist) => artist.fields.id === songs[0].fields.artistId
  );

  const artistFields = artist?.fields as IArtist;

  const albumAssets = albumsResponse.includes?.Asset as unknown as IAsset[];
  const albumAsset = albumAssets.find((alb) => {
    return alb.sys.id === albumFields.artwork.sys.id;
  });

  return (
    <div className="container py-8">
      <Player
        album={albumFields}
        artists={artistResponse}
        band={artistFields}
        artwork={albumAsset}
        songs={songs}
      />
    </div>
  );
};

export default Song;
