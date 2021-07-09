import leaderboard from '../../server/leaderboard';

export default async (req, res) => {
  const { request } = req.query;

  const baseURL = `http://${req.headers.host}/`;
  const reqUrl = new URL(req.url, baseURL);
  const { id } = Object.fromEntries(reqUrl.searchParams);
  req.id = id;

  switch (request) {
    case 'leaderboard':
      try {
        const response = await leaderboard(req);
        const { statusCode, ...rest } = response;
        return res.status(statusCode).json({ ...rest });
      } catch (e) {
        return res.status(500).end();
      }
    default:
      return res.status(400).json({ Error: 'Invalid request' });
  }
};
