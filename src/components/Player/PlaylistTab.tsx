"use client";

import { cn } from "@/lib/utils";
import { ISong } from "@/types/Song";
import { Entry, EntrySkeletonType } from "contentful";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

interface Props {
  songs: Entry<EntrySkeletonType<ISong>, undefined, string>[];
}

const PlaylistTab = ({ songs }: Props) => {
  const { albumId, songId } = useParams<{
    albumId: string;
    songId: string;
  }>();
  const pathname = usePathname();
  return (
    <ul>
      {songs
        .sort((a, b) => {
          const aTrackNo = a.fields.trackNo as number;
          const bTrackNo = b.fields.trackNo as number;

          if (aTrackNo < bTrackNo) return -1;
          if (aTrackNo > bTrackNo) return 1;
          return 0;
        })
        .map((song) => {
          const songFileds = song.fields as ISong;

          return (
            <React.Fragment key={song.sys.id}>
              <li
                className={cn(
                  `my-1 flex items-center justify-start gap-1 border border-transparent p-1 hover:rounded-sm hover:border hover:border-secondary-foreground ${
                    pathname === `/${albumId}/${songFileds.id}`
                      ? "rounded-sm border-primary"
                      : ""
                  }`,
                )}
              >
                <span className="min-w-8">
                  {song.fields.trackNo < 10
                    ? `0${song.fields.trackNo}`
                    : song.fields.trackNo}
                  .
                </span>{" "}
                <Link
                  href={`/${albumId}/${songFileds.id}`}
                  className="flex grow items-center justify-between gap-4"
                >
                  {songFileds.name}
                  <span>{song.fields.duration}</span>
                </Link>
              </li>
            </React.Fragment>
          );
        })}
    </ul>
  );
};

export default PlaylistTab;
