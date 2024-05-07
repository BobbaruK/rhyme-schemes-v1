export interface IAlbum {
  id: string;
  slug: string;
  name: string;
  year: number;
  artwork: {
    sys: {
      type: string;
      linkType: string;
      id: string;
    };
  };
}
