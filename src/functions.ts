import puppeteer from 'puppeteer';

const base_url = "https://myanimelist.net"

type ResponseData = {
  status_code: number,
  url?: string
  title?: string,
  text?: string,
  img_link?: string,
}

async function select_random_anime(user: String, status_list: Array<number>): Promise<ResponseData> {
  let status_index = select_index(0, status_list.length)
  let status = status_list[status_index]

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    const blockedResourceTypes = ['image', 'stylesheet', 'font', 'media'];
    if (blockedResourceTypes.includes(req.resourceType())) {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(base_url + `/animelist/${user}?status=${status}`, { waitUntil: 'domcontentloaded' });

  const links = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('td.title a.link.sort'));
    return anchors
      .map(a => ({
        url: a.getAttribute('href'),
        title: a.textContent?.trim() || ''
      }))
      .filter(item => item.url !== null) as { url: string; title: string }[];
  });

  await browser.close();

  const anime = links[select_index(0, links.length)]

  return { "status_code": 200, ...anime }
}


async function get_anime_data(url: string): Promise<ResponseData> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image') {
      req.abort();
    } else {
      req.continue();
    }
  });

  await page.goto(base_url + url, { waitUntil: 'domcontentloaded' });

  const result = await page.evaluate((): ResponseData => {
    const img = document.querySelector('img[itemprop="image"]') as HTMLImageElement | null;;
    const imgSrc = img ? img.getAttribute('data-src') || img.src : undefined;

    const textElem = document.querySelector('p[itemprop="description"]');
    const textContent = textElem ? textElem.textContent?.trim() || undefined : undefined;

    return { "status_code": 200, "img_link": imgSrc, "text": textContent };
  });

  await browser.close();
  return result;
}


function select_index(min_index: number, max_index: number): number {
  return Math.floor(Math.random() * (max_index - min_index) + min_index)
}


export async function get_recommondation_data(user: string, status_list: Array<number>): Promise<ResponseData> {
  const response = await select_random_anime(user, status_list)
  if (response.status_code == 200) {
    const anime_data = await get_anime_data(response.url || "")
    const result = { ...anime_data, "title": response.title }
    console.log(result)
    return result
  }
  else
    return { "status_code": 400 }
}

