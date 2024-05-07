export interface ISong {
  id: string;
  trackNo: number;
  name: string;
  artistId: string;
  albumId: string;
  duration: string;
  link: string;
  writers: string[];
  instrumental: string[];
  rhymes?: any;
}
