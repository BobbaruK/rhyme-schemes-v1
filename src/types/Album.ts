export interface IAlbum {
  albumId: string;
  albumSlug: string;
  albumName: string;
  albumYear: number;
  albumArtwork: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
}
