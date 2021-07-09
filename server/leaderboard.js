import { admin, db } from './firebaseAdmin';

export default async function leaderboard(req) {
  if (req.method.toLowerCase() === 'post') {
    const payload = req.body;
    try {
      const response = await db.collection('games').add({
        ...payload,
        timestamp: admin.firestore.Timestamp.fromDate(new Date()),
      });
      if (response.id) {
        return ({ id: response.id, statusCode: 200 });
      }
    } catch (e) {
      return ({ Error: e.details, statusCode: 500 });
    }
  } else if (req.method.toLowerCase() === 'get') {
    const gamesRef = db.collection('games');
    const { id } = req;
    try {
      const snapshot = await gamesRef.orderBy('score', 'desc').orderBy('timeTaken').orderBy('name')
        .get();
      let games = [];
      snapshot.forEach((doc) => {
        const { timestamp, ...rest } = doc.data();
        games.push({ ...rest, id: doc.id });
      });
      games = games.map((game, index) => ({ ...game, rank: index + 1 }));
      const slicedGames = games.slice(0, 10);
      if (id) {
        if (!slicedGames.some((game) => game.id === id)) {
          const idGame = games.find((game) => game.id === id);
          slicedGames.push(idGame);
        }
      }
      return ({ games: slicedGames, statusCode: 200 });
    } catch (e) {
      return ({ Error: e.details, statusCode: 500 });
    }
  }
  return ({ statusCode: 400 });
}
