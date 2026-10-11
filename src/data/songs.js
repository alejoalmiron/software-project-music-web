const photo = (id) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=640&q=85`

export const GENRES = ['Pop', 'Rock', 'Hip Hop', 'Electrónica']

export const songs = [
  { id: 1, title: 'Midnight City', artist: 'M83', genre: 'Pop', duration: 243, image: photo('1519608487953-e999c86e7455') },
  { id: 2, title: 'Golden', artist: 'Harry Styles', genre: 'Pop', duration: 208, image: photo('1470225620780-dba8ba36b745') },
  { id: 3, title: 'Electric Feel', artist: 'MGMT', genre: 'Pop', duration: 229, image: photo('1501386761578-eac5c94b800a') },
  { id: 4, title: 'Dreams', artist: 'The Cranberries', genre: 'Pop', duration: 271, image: photo('1493225457124-a3eb161ffa5f') },
  { id: 5, title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', genre: 'Rock', duration: 272, image: photo('1459749411175-04bf5292ceea') },
  { id: 6, title: 'Everlong', artist: 'Foo Fighters', genre: 'Rock', duration: 250, image: photo('1524368535928-5b5e00ddc76b') },
  { id: 7, title: 'Californication', artist: 'Red Hot Chili Peppers', genre: 'Rock', duration: 321, image: photo('1506157786151-b8491531f063') },
  { id: 8, title: 'The Pretender', artist: 'Foo Fighters', genre: 'Rock', duration: 269, image: photo('1501386761578-eac5c94b800a') },
  { id: 9, title: 'Passionfruit', artist: 'Drake', genre: 'Hip Hop', duration: 298, image: photo('1516280440614-37939bbacd81') },
  { id: 10, title: 'Good Days', artist: 'SZA', genre: 'Hip Hop', duration: 278, image: photo('1514525253161-7a46d19cd819') },
  { id: 11, title: 'Nights', artist: 'Frank Ocean', genre: 'Hip Hop', duration: 307, image: photo('1487180144351-b8472da7d491') },
  { id: 12, title: 'After Hours', artist: 'The Weeknd', genre: 'Hip Hop', duration: 361, image: photo('1492684223066-81342ee5ff30') },
  { id: 13, title: 'Innerbloom', artist: 'RÜFÜS DU SOL', genre: 'Electrónica', duration: 330, image: photo('1470225620780-dba8ba36b745') },
  { id: 14, title: 'Sunset Lover', artist: 'Petit Biscuit', genre: 'Electrónica', duration: 238, image: photo('1519608487953-e999c86e7455') },
  { id: 15, title: 'A Moment Apart', artist: 'ODESZA', genre: 'Electrónica', duration: 244, image: photo('1506157786151-b8491531f063') },
  { id: 16, title: 'Strobe', artist: 'deadmau5', genre: 'Electrónica', duration: 312, image: photo('1501386761578-eac5c94b800a') },
]

export function getSongById(id) {
  return songs.find((song) => song.id === id)
}

export function getSongsByGenre(genre) {
  return songs.filter((song) => song.genre === genre)
}