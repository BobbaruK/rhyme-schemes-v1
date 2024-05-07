import { IAlbum } from "@/types/Album";
import { IArtist } from "@/types/Artist";
import { ISong } from "@/types/Song";
import { Entry, EntrySkeletonType } from "contentful";
import React from "react";

interface Props {
  actualSong: Entry<EntrySkeletonType<ISong>, undefined, string> | undefined;
  album: IAlbum;
  artists: Entry<EntrySkeletonType<IArtist>, undefined, string>[];
}

const DetailsTab = ({ actualSong, album, artists }: Props) => {
  const getWriter = () => {
    const writers = [
      ...(actualSong ? actualSong.fields.writers : []),
    ] as string[];

    const output: string[] = [];

    for (let i = 0; i < writers.length; i++) {
      const artist = artists.find((artist) => artist.fields.id === writers[i]);

      output.push(artist?.fields.name as unknown as string);
    }

    return output;
  };
  const writers = getWriter();

  const getProducer = () => {
    const actualSongProducerId = actualSong?.fields
      .instrumental as unknown as string;

    if (actualSongProducerId === "other") return "De pe net";

    const artist = artists.find(
      (artist) => artist.fields.id === actualSongProducerId
    );
    const artistName = artist?.fields.name as unknown as string;

    return artistName;
  };
  const producer = getProducer();

  return (
    <div className="flex flex-col gap-2">
      <p>
        Album: <strong>{album.name}</strong>
      </p>
      <p>
        Track: <strong>{actualSong?.fields.trackNo}</strong>
      </p>
      <p>
        Nume: <strong>{actualSong?.fields.name}</strong>
      </p>
      <p>
        Text:{" "}
        <strong>
          {writers.map((writer, index) => (
            <React.Fragment key={writer.replaceAll(" ", "-") + "-" + index}>
              <span>{writer}</span>
              {writers.length !== index + 1 && <> / </>}
            </React.Fragment>
          ))}
        </strong>
      </p>
      <p>
        Instrumental: <strong>{producer}</strong>
      </p>
      <p>
        An: <strong>{album.year}</strong>
      </p>
    </div>
  );
};

export default DetailsTab;
