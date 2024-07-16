async function scrapeEvents() {
  try {
    const response = await axios.get('https://guichet.com'); // Remplacez par l'URL correcte
    const html = response.data;
    const $ = cheerio.load(html);

    const mainTitle = $('h1').text().trim(); // Exemple simple de récupération de titre principal
    console.log('Main Title:', mainTitle);

    // Continuez avec l'extraction des événements...
  } catch (error) {
    console.error('Error fetching or parsing data:', error);
    return [];
  }
}
